import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

const COLLECTION = {
  USERS: "users",
  LOGIN_KEYS: "loginKeys",
  SETTINGS: "settings",
  COUNTERS: "counters",
  LOGS: "logs",
};

const DOCUMENT = {
  SYSTEM: "system",
};

const DEFAULT_SUPERADMIN_USERNAME =
  "RBSUPERADMIN";

const normalizeLoginKey = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const isInitialized = async () => {
  const systemRef = doc(
    db,
    COLLECTION.SETTINGS,
    DOCUMENT.SYSTEM
  );

  const snapshot = await getDoc(systemRef);

  if (!snapshot.exists()) {
    return false;
  }

  return snapshot.data().initialized === true;
};

const createDefaultSuperadmin = (
  transaction,
  authUser,
  profile
) => {
  if (!authUser?.uid || !authUser?.email) {
    throw new Error(
      "User Firebase Auth tidak valid. Silakan login ulang."
    );
  }

  const uid = authUser.uid;
  const email = normalizeLoginKey(authUser.email);
  const usernameKey =
    normalizeLoginKey(DEFAULT_SUPERADMIN_USERNAME);

  const userRef = doc(
    db,
    COLLECTION.USERS,
    uid
  );

  const emailLoginKeyRef = doc(
    db,
    COLLECTION.LOGIN_KEYS,
    email
  );

  const usernameLoginKeyRef = doc(
    db,
    COLLECTION.LOGIN_KEYS,
    usernameKey
  );

  const superadminProfile = {
    uid,
    username: DEFAULT_SUPERADMIN_USERNAME,
    name:
      profile?.name ||
      authUser.displayName ||
      "Super Admin",
    email,
    role: "superadmin",
    active: true,
    loginKeys: [
      email,
      usernameKey,
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const loginKeyData = {
    uid,
    email,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  transaction.set(userRef, superadminProfile);

  transaction.set(
    emailLoginKeyRef,
    loginKeyData
  );

  transaction.set(
    usernameLoginKeyRef,
    loginKeyData
  );

  return {
    uid,
    username: DEFAULT_SUPERADMIN_USERNAME,
    name: superadminProfile.name,
    email,
    role: "superadmin",
    active: true,
    loginKeys: [
      email,
      usernameKey,
    ],
  };
};

const createSettings = (transaction) => {
  const systemRef = doc(
    db,
    COLLECTION.SETTINGS,
    DOCUMENT.SYSTEM
  );

  transaction.set(systemRef, {
    initialized: true,
    schoolName:
      "Rumah Belajar Ubaidillah Bin Abdullah",
    version: "1.0.0",
    timezone: "Asia/Jakarta",
    locale: "id-ID",
    currency: "IDR",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const createCounters = (transaction) => {
  const year = new Date().getFullYear();

  const counters = [
    {
      code: "student",
      prefix: "ST",
      sequence: 0,
      digits: 6,
      yearlyReset: false,
      currentYear: null,
    },
    {
      code: "employee",
      prefix: "ADM",
      sequence: 1,
      digits: 3,
      yearlyReset: false,
      currentYear: null,
    },
    {
      code: "payment",
      prefix: "PAY",
      sequence: 0,
      digits: 6,
      yearlyReset: true,
      currentYear: year,
    },
    {
      code: "commitment",
      prefix: "COM",
      sequence: 0,
      digits: 6,
      yearlyReset: true,
      currentYear: year,
    },
  ];

  counters.forEach((counter) => {
    const counterRef = doc(
      db,
      COLLECTION.COUNTERS,
      counter.code
    );

    transaction.set(counterRef, {
      ...counter,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

const createFirstLog = (
  transaction,
  superadminProfile
) => {
  const logRef = doc(
    db,
    COLLECTION.LOGS,
    "initialize"
  );

  transaction.set(logRef, {
    action: "INITIALIZE_DATABASE",
    actorUid: superadminProfile?.uid ?? null,
    actorName:
      superadminProfile?.name ?? "Super Admin",
    module: "system",
    description:
      "Database initialized successfully.",
    createdAt: serverTimestamp(),
  });
};

const initialize = async (
  authUser,
  profile
) => {
  await runTransaction(
    db,
    async (transaction) => {
      const systemRef = doc(
        db,
        COLLECTION.SETTINGS,
        DOCUMENT.SYSTEM
      );

      const snapshot =
        await transaction.get(systemRef);

      if (
        snapshot.exists() &&
        snapshot.data().initialized === true
      ) {
        return;
      }

      const superadminProfile =
        createDefaultSuperadmin(
          transaction,
          authUser,
          profile
        );

      createSettings(transaction);

      createCounters(transaction);

      createFirstLog(
        transaction,
        superadminProfile
      );
    }
  );
};

const setupService = {
  isInitialized,
  initialize,
};

export default setupService;