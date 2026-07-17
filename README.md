# Cianelle Luxe Fragrances

React/Vite storefront backed by Firebase Authentication, Cloud Firestore and Vercel Serverless Functions.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Firebase Web App values.
3. Start the app with `npm run dev`.

`npm run dev` serves the frontend only. To exercise the `/api` serverless endpoints locally, configure the Admin environment variables and run:

```powershell
npx vercel dev
```

The `.env` file is intentionally ignored by Git. Firebase web configuration is not a server secret, but keeping it in environment variables prevents accidentally connecting a local build to the wrong Firebase project. Never add a service-account JSON file or private key to this repository.

## Firebase services

- Email/password Authentication is used for customer and administrator accounts.
- Firestore stores profiles, inventory, product metadata, orders, company settings and migration metadata.
- Vercel Serverless Functions verify Firebase ID tokens and perform trusted inventory/order writes.
- The shopping cart stays in the browser's `localStorage`.
- Product images remain bundled with the app. Cloud Storage is intentionally disabled until the owner chooses to enable Blaze billing.

Authorized administrator UIDs are enforced in Firestore rules, the client configuration and the serverless API configuration. Keep all three allowlists synchronized and redeploy after adding or removing an administrator.

## Serverless order and inventory flow

Customers cannot write orders or inventory directly to Firestore.

1. The browser sends only product IDs and quantities to `/api/orders/create`.
2. The serverless function verifies the customer's Firebase ID token.
3. It reads current product prices and stock from Firestore.
4. A Firestore Admin transaction validates availability, calculates the total, creates the order and decrements stock atomically.
5. The admin advances orders through `Pending → Confirmed → Processing → Ready → Delivered`.
6. Cancelling an unfinished order restores its inventory in the same transaction.

Order history is retained rather than deleted so customer support, fulfilment tracking and analytics remain accurate.

## Firebase Admin credentials for Vercel

The serverless functions need a Firebase service account. The Firebase project owner should create or select a service account in Firebase/Google Cloud project settings and add these values directly in **Vercel → Project Settings → Environment Variables**:

```text
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_ADMIN_UIDS
```

Set `FIREBASE_ADMIN_UIDS` and `VITE_FIREBASE_ADMIN_UIDS` to the same comma-separated UID list. The legacy single-admin variables `FIREBASE_ADMIN_UID` and `VITE_FIREBASE_ADMIN_UID` remain supported during migration.

For the private key, paste the complete value including:

```text
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

Never prefix Admin credentials with `VITE_`. Never commit a service-account JSON file, client email/private key combination, or private key to Git. The `VITE_FIREBASE_*` variables are public web configuration; the `FIREBASE_ADMIN_*` variables are server-only secrets.

## Deploy Firestore rules

Sign into the Firebase CLI with the Google account that has Editor access, then deploy the rules and indexes:

```powershell
npx firebase login
npm run firebase:deploy-rules
```

The default project is configured in `.firebaserc` as `cianelle-luxe-fragrances`.

## Initial catalogue seed

After the rules and Vercel server credentials are deployed, visit `/admin` and sign in with the approved administrator Firebase account. A protected serverless endpoint seeds the bundled catalogue and company settings exactly once, then initializes stock fields for older product documents.

Only product metadata is stored in Firestore. Bundled images are matched to Firestore documents by product ID so their URLs remain valid across Vercel builds.

## Vercel deployment

Add the public `VITE_FIREBASE_*` variables and private `FIREBASE_ADMIN_*` variables from `.env.example` to Vercel, then redeploy. Apply them to both Preview and Production when pull-request previews must work. After Vercel provides the production domain, add that domain in Firebase Console under Authentication settings and Authorized domains.

Before production use, verify:

- A customer can place an in-stock order.
- The product stock decreases by the ordered quantity.
- The total uses the Firestore price even if browser data is modified.
- An out-of-stock order is rejected.
- Only the approved administrator can edit inventory and update statuses.
- Cancelling an order restores its stock once.
- The customer sees live status changes in order history.

## Verification

```powershell
npm run lint
npm run build
```
