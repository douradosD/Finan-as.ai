// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuração do Firebase (Copiado do Console)
const firebaseConfig = {
  apiKey: "AIzaSyDb9vgCuaAqLqQG7TG7STwwQ3yx40CELFw",
  authDomain: "financas-ai-f02e6.firebaseapp.com",
  projectId: "financas-ai-f02e6",
  storageBucket: "financas-ai-f02e6.firebasestorage.app",
  messagingSenderId: "944859253490",
  appId: "1:944859253490:web:773ad82a027c3f7fc05e6b",
  measurementId: "G-N5XMEPKQVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Função de Login com Google
export const loginGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
};

// Função de Logout
export const logoutFirebase = async () => {
    return signOut(auth);
};

// Upload de Avatar do Usuário e atualização do photoURL
export const uploadUserAvatar = async (file, userId) => {
    const fileRef = ref(storage, `users/${userId}/avatar.jpg`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
    }
    return url;
};
