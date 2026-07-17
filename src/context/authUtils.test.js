import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUsers, findUserByCredentials } from './authUtils.js';

test('findUserByCredentials matches an existing account even when the stored data has mixed casing and whitespace', () => {
  const storedUsers = normalizeUsers([{
    id: 'user-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: '  Ada@Example.com ',
    password: ' Secret123 ',
    country: 'Nigeria',
    address: 'Lagos',
    phone: '08100000000',
  }]);

  const matchedUser = findUserByCredentials(storedUsers, 'ada@example.com', 'Secret123');

  assert.ok(matchedUser);
  assert.equal(matchedUser.email, 'ada@example.com');
  assert.equal(matchedUser.password, 'Secret123');
});
