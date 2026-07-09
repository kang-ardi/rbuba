# User Management Firestore Rules Analysis

## Collections touched

- `users/{uid}`: contains PII and access fields: `uid`, `username`, `name`, `email`, `role`, `active`, `loginKeys`, `createdAt`, `updatedAt`.
- `loginKeys/{key}`: maps normalized email/username login keys to `uid`, `email`, `active`, `createdAt`, `updatedAt`.

## App queries and writes

- `users`: `query(collection(db, "users"), orderBy("name"))` for admin user management.
- `users/{uid}`: current profile read by authenticated owner.
- `users/{uid}` create: admin UI creates Auth user first, then creates Firestore user profile.
- `users/{uid}` update: admin UI updates `name`, `role`, `active`, and `updatedAt`; immutable identity fields remain unchanged.
- `loginKeys/{key}` create: created with a new user profile for email and username login.
- `loginKeys/{key}` update: `active` mirrors the corresponding user status.

## Role model

Role order from highest to lowest:

1. `superadmin`
2. `admin`
3. `siswa`

Managers may manage users with the same or lower rank. Owners may read their own profile and update only non-privilege profile data already allowed by the existing rules.

## Devil's advocate summary

- Public list exploit: denied because `users` list requires an active `admin` or `superadmin`.
- Privilege escalation: denied by `canManageRoleValue()` checks on both existing and requested role.
- Update bypass: mitigated by `isValidUser()` on update and immutable checks for `uid`, `username`, `email`, `loginKeys`, and `createdAt`.
- Login key mismatch: mitigated by `getAfter()` checks that require the corresponding user document to exist after the batch and match `email`/`active`.
- PII exposure: intentionally allowed to active `admin` and `superadmin` users for the requested user-management screen. This should be reviewed before broad production rollout.
