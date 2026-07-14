# Cianelle Luxe Fragrances

React/Vite storefront backed by Firebase Authentication and Cloud Firestore.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Firebase Web App values.
3. Start the app with `npm run dev`.

The `.env` file is intentionally ignored by Git. Firebase web configuration is not a server secret, but keeping it in environment variables prevents accidentally connecting a local build to the wrong Firebase project. Never add a service-account JSON file or private key to this repository.

## Firebase services

- Email/password Authentication is used for customer and administrator accounts.
- Firestore stores profiles, product metadata, orders, company settings and seed metadata.
- The shopping cart stays in the browser's `localStorage`.
- Product images remain bundled with the app. Cloud Storage is intentionally disabled until the owner chooses to enable Blaze billing.

The authorized administrator UID is enforced in both `firestore.rules` and `VITE_FIREBASE_ADMIN_UID`. Changing the administrator requires updating both values and redeploying the rules.

## Deploy Firestore rules

Sign into the Firebase CLI with the Google account that has Editor access, then deploy:

```powershell
npx firebase login
npm run firebase:deploy-rules
```

The default project is configured in `.firebaserc` as `cianelle-luxe-fragrances`.

## Initial catalogue seed

After the rules are deployed, visit `/admin` and sign in with the approved administrator Firebase account. The app seeds the bundled catalogue and company settings exactly once. It writes `meta/catalog-v1` after a successful seed so later sign-ins do not create duplicates.

Only product metadata is stored in Firestore. Bundled images are matched to Firestore documents by product ID so their URLs remain valid across Vercel builds.

## Vercel deployment

Add every variable from `.env.example` to the Vercel project's Environment Variables, then deploy. After Vercel provides the production domain, add that domain in Firebase Console under Authentication settings and Authorized domains.

## Verification

```powershell
npm run lint
npm run build
```
