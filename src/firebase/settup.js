import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, set, getDocs, query, updateDoc, serverTimestamp, addDoc, orderBy, doc, deleteDoc, Timestamp, setDoc } from "firebase/firestore"
import { returnMessage } from "../tools/alertTools";
import { getAuthCredentias } from "./auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1BQg_aO360A1QUQiQaOAOatwBQqu6lu8",
    authDomain: "cashless-20f70.firebaseapp.com",
    projectId: "cashless-20f70",
    storageBucket: "cashless-20f70.appspot.com",
    messagingSenderId: "735776965674",
    appId: "1:735776965674:web:22b9fae0f28ca91603af53",
    measurementId: "G-JF2X1KH38Z"
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