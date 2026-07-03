import { db } from "../firebase";

export default function TestFirebase() {
  console.log("Firestore Connected :", db);

  return (
    <div className="container py-5">
      <h2>Firebase Connected ✅</h2>
    </div>
  );
}