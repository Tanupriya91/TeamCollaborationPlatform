import { createContext, useContext, useEffect, useState } from "react";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import { auth } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [idToken, setIdToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const token = await currentUser.getIdToken();
                setIdToken(token);
            } else {
                setIdToken(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function signup(email, password) {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const token = await result.user.getIdToken();

        setUser(result.user);
        setIdToken(token);

        return result.user;
    }

    async function login(email, password) {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const token = await result.user.getIdToken();

        setUser(result.user);
        setIdToken(token);

        return result.user;
    }

    async function logout() {
        await signOut(auth);

        setUser(null);
        setIdToken(null);
    }

    const value = {
        user,
        idToken,
        loading,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}