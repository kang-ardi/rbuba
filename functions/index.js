const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.updateUserPassword = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Login diperlukan."
    );
  }

  const callerSnapshot = await db
    .doc(`users/${request.auth.uid}`)
    .get();

  const caller = callerSnapshot.data();

  if (
    !callerSnapshot.exists ||
    caller?.role !== "superadmin" ||
    caller?.active !== true
  ) {
    throw new HttpsError(
      "permission-denied",
      "Hanya superadmin yang bisa mengubah password user lain."
    );
  }

  const { uid, password } = request.data || {};

  if (
    typeof uid !== "string" ||
    uid.length < 1 ||
    uid.length > 128
  ) {
    throw new HttpsError(
      "invalid-argument",
      "User tidak valid."
    );
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 128
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Password minimal 6 karakter."
    );
  }

  await admin.auth().updateUser(uid, {
    password,
  });

  return {
    success: true,
  };
});
