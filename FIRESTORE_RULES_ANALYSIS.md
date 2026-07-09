# Firestore Rules Analysis

This project uses Firebase Auth and Firestore from a React/Vite client.

## Firestore Instance

- Project: `rb-uba`
- Database: `(default)`
- Edition: `STANDARD`
- Type: `FIRESTORE_NATIVE`

## Collections And Access Patterns

### `loginKeys/{key}`

Fields observed in application code:

- `uid`: Firebase Auth UID
- `email`: lowercase email used for Firebase Auth sign-in
- `active`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp

Access:

- Public `get` by exact key is required before sign-in for username/NIS/NIP login.
- Listing is denied to prevent enumeration.
- Superadmin maintains these documents when creating, deleting, or toggling users.
- Authenticated users may create missing login key documents only for their own
  account, matching their existing profile email/status and either their email
  key or a key already listed on their profile. This supports safe migration for
  older accounts after email login.
- The user management page backfills missing login key documents for existing users.
- `findByUsername` keeps a legacy fallback query during migration; this only works before the stricter rules are deployed.

### `users/{uid}`

Fields observed in application code:

- `name`: string
- `email`: string
- `role`: one of `superadmin`, `admin`, `student`
- `active`: boolean
- `loginKeys`: array containing lowercase email, username, and NIS/NIP
- `createdAt`: timestamp
- `updatedAt`: timestamp

Queries:

- `orderBy("name")` for superadmin user management.
- `getDoc("users", uid)` for current profile.

Writes:

- Superadmin creates and updates user documents from the user management UI.
- Deletion is blocked in the client because deleting another Firebase Auth user requires Admin SDK/backend authority.
- A user cannot deactivate their own account in client code.
- Login lookup now uses `loginKeys/{key}` instead of querying this PII collection before authentication.

### `settings/system`

Fields observed in application code:

- `initialized`: boolean
- `schoolName`: string
- `version`: string
- `timezone`: string
- `locale`: string
- `currency`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

Access:

- Authenticated users read this document through `setupService.isInitialized()`.
- Superadmin creates it during setup.

### `counters/{code}`

Fields observed in application code:

- `code`: string
- `prefix`: string
- `sequence`: integer
- `digits`: integer
- `yearlyReset`: boolean
- `currentYear`: integer or null
- `createdAt`: timestamp
- `updatedAt`: timestamp

Access:

- Superadmin creates counters during setup.
- Number generation exists in `counterService`, but no page currently calls it.

### `logs/initialize`

Fields observed in application code:

- `action`: string
- `actorUid`: string or null
- `actorName`: string
- `module`: string
- `description`: string
- `createdAt`: timestamp

Access:

- Superadmin creates the first setup log.

## Rule Design Notes

- Default deny is required for unknown collections.
- User documents contain PII, so normal users can only read their own document.
- Public login lookup is isolated in `loginKeys/{key}` and allows exact document reads only, not collection listing.
- Superadmin is determined from the existing authenticated user's `users/{uid}` document.
- Superadmin creation has a bootstrap path only before `settings/system` exists.
- Validators are used on create and update to avoid update bypasses.
