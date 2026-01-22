import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    onSnapshot,
    orderBy
} from "firebase/firestore";

// --- TRANSAÇÕES ---

// Escutar transações em tempo real
export const subscribeTransactions = (userId, callback) => {
    if (!userId) return () => {};
    
    const q = query(
        collection(db, "users", userId, "transactions"),
        orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(transactions);
    });
};

export const addTransactionDB = async (userId, transaction) => {
    if (!userId) return;
    await addDoc(collection(db, "users", userId, "transactions"), transaction);
};

export const updateTransactionDB = async (userId, transactionId, updatedData) => {
    if (!userId) return;
    const ref = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(ref, updatedData);
};

export const deleteTransactionDB = async (userId, transactionId) => {
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
};


// --- METAS (GOALS) ---

export const subscribeGoals = (userId, callback) => {
    if (!userId) return () => {};
    
    const q = query(collection(db, "users", userId, "goals"));

    return onSnapshot(q, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(goals);
    });
};

export const addGoalDB = async (userId, goal) => {
    if (!userId) return;
    await addDoc(collection(db, "users", userId, "goals"), goal);
};

export const updateGoalDB = async (userId, goalId, updatedData) => {
    if (!userId) return;
    const ref = doc(db, "users", userId, "goals", goalId);
    await updateDoc(ref, updatedData);
};

export const deleteGoalDB = async (userId, goalId) => {
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "goals", goalId));
};
