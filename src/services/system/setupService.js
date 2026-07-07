import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

const COLLECTION = {
  SETTINGS: "settings",
  COUNTERS: "counters",
  LOGS: "logs",
};

const DOCUMENT = {
  SYSTEM: "system",
};

/* ======================================================
   CHECK INITIALIZATION
====================================================== */

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

/* ======================================================
   SETTINGS
====================================================== */

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

/* ======================================================
   COUNTERS
====================================================== */

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

/* ======================================================
   FIRST LOG
====================================================== */

const createFirstLog = (
  transaction,
  profile
) => {

  const logRef = doc(
    db,
    COLLECTION.LOGS,
    "initialize"
  );

  transaction.set(logRef, {

    action: "INITIALIZE_DATABASE",

    actorUid: profile?.uid ?? null,

    actorName:
      profile?.name ??
      profile?.displayName ??
      "Superadmin",

    module: "system",

    description:
      "Database initialized successfully.",

    createdAt: serverTimestamp(),

  });

};

/* ======================================================
   INITIALIZE DATABASE
====================================================== */

const initialize = async (
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

      // Sudah pernah diinisialisasi
      if (
        snapshot.exists() &&
        snapshot.data().initialized
      ) {
        return;
      }

      createSettings(transaction);

      createCounters(transaction);

      createFirstLog(
        transaction,
        profile
      );

    }
  );

};

/* ======================================================
   EXPORT
====================================================== */

const setupService = {

  isInitialized,

  initialize,

};

export default setupService;