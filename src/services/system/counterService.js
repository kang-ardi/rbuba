import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

const COUNTERS_COLLECTION = "counters";

/* ======================================================
   FORMAT NUMBER
====================================================== */

const padNumber = (number, digits) => {
  return String(number).padStart(digits, "0");
};

/* ======================================================
   GENERATE NEXT NUMBER
====================================================== */

const next = async (code) => {

  return await runTransaction(
    db,
    async (transaction) => {

      const counterRef = doc(
        db,
        COUNTERS_COLLECTION,
        code
      );

      const snapshot =
        await transaction.get(counterRef);

      if (!snapshot.exists()) {
        throw new Error(
          `Counter "${code}" tidak ditemukan.`
        );
      }

      const counter = snapshot.data();

      let sequence =
        counter.sequence ?? 0;

      let currentYear =
        counter.currentYear ?? null;

      const nowYear =
        new Date().getFullYear();

      // Reset tahunan
      if (counter.yearlyReset) {

        if (currentYear !== nowYear) {

          sequence = 0;

          currentYear = nowYear;

        }

      }

      sequence++;

      transaction.update(
        counterRef,
        {

          sequence,

          currentYear,

          updatedAt:
            serverTimestamp(),

        }
      );

      // Format nomor

      const runningNumber =
        padNumber(
          sequence,
          counter.digits
        );

      if (counter.yearlyReset) {

        const year =
          String(currentYear)
            .slice(-2);

        return `${counter.prefix}${year}${runningNumber}`;

      }

      return `${counter.prefix}${runningNumber}`;

    }
  );

};

/* ======================================================
   PREVIEW NUMBER
   (Tidak menaikkan sequence)
====================================================== */

const preview = async (code) => {

  const counterRef = doc(
    db,
    COUNTERS_COLLECTION,
    code
  );

  const snapshot =
    await getDoc(counterRef);

  if (!snapshot.exists()) {

    throw new Error(
      `Counter "${code}" tidak ditemukan.`
    );

  }

  const counter =
    snapshot.data();

  let sequence =
    (counter.sequence ?? 0) + 1;

  let currentYear =
    counter.currentYear;

  const nowYear =
    new Date().getFullYear();

  if (
    counter.yearlyReset &&
    currentYear !== nowYear
  ) {

    sequence = 1;

    currentYear = nowYear;

  }

  const runningNumber =
    padNumber(
      sequence,
      counter.digits
    );

  if (counter.yearlyReset) {

    return `${counter.prefix}${String(currentYear).slice(-2)}${runningNumber}`;

  }

  return `${counter.prefix}${runningNumber}`;

};

/* ======================================================
   EXPORT
====================================================== */

const counterService = {

  next,

  preview,

};

export default counterService;