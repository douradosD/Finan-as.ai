import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginGoogle, logoutFirebase, auth, uploadUserAvatar } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Monitorar estado de autenticação (Firebase)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    id: currentUser.uid,
                    name: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await loginGoogle();
            // O onAuthStateChanged vai cuidar de atualizar o estado
        } catch (error) {
            console.error("Erro ao logar:", error);
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutFirebase();
            setUser(null);
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    const updateUserPhoto = async (file) => {
        if (!user?.id) return;
        try {
            const url = await uploadUserAvatar(file, user.id);
            setUser(prev => prev ? { ...prev, photoURL: url } : prev);
            return url;
        } catch (error) {
            console.error("Erro ao atualizar foto:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout, updateUserPhoto }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
