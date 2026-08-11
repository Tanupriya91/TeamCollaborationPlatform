import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "./config/firebase.js";

const uid = "ZBUjUmNVMNTFhHq7N6kE7XeVmvK2";

try {
    await getAuth(firebaseApp).updateUser(uid, {
        password: "TestPassword123!"
    });

    console.log("Password updated successfully");
} catch (error) {
    console.error("Failed to update password:", error);
}