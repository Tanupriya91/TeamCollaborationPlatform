import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccount.json" with { type: "json" };

const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore(firebaseApp);

export { firebaseApp, db };