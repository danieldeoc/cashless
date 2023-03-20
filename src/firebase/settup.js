import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, set, getDocs, query, updateDoc, serverTimestamp, addDoc, orderBy, doc, deleteDoc, Timestamp, setDoc } from "firebase/firestore"
import { returnMessage } from "../tools/alertTools";
import { getAuthCredentias } from "./auth";

// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyD6txBIF18GfL7EvXyouaADDFqK9rJd6cA",
    authDomain: "cashless-appdoc.firebaseapp.com",
    projectId: "cashless-appdoc",
    storageBucket: "cashless-appdoc.appspot.com",
    messagingSenderId: "3827619937",
    appId: "1:3827619937:web:4b0bedbaa556b077897220",
    measurementId: "G-9Y22LJCR68"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

const credentials = getAuthCredentias();
const userDb = "userdb_"+credentials.id;
const collectionRef = "settings";

export async function settupSetting(){    
    await setDoc(doc(db, userDb, "account_settings"), {
        currency_options: ["Euro", "Dolar", "Real", "Pound"],
        payment_options: ["Debit Card", "Account Debit"]
    });

    await setDoc(doc(db, userDb, "product_settings"), {
        Weights: ["Unt", "Kg", "Lt"]
    });
    return true;
}