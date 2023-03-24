import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, increment, collection, updateDoc, getDocs, query, addDoc, orderBy, doc, deleteDoc, Timestamp, setDoc, where, limit } from "firebase/firestore"
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
const superDoc = "stores_catalog";
const collectionRef = "stores";
const colRef = collection(db, userDb, superDoc, collectionRef);

export async function getTopStores(){
    let stores = [];

    const querySettings = query(colRef, orderBy('Uses', 'desc'), limit(4));

    await getDocs(querySettings)
        .then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                stores.push( {...doc.data(), id: doc.id} )
            })
        }).finally(
            () => {
                if(stores.length == 0){
                    stores = ["No stores registered yet"]
                }
            }
        );
        
    return stores;
}

export async function addStore(store){
    let stores = [];
    const querySettings = query(colRef, where("Name", "==", store));
    await getDocs(querySettings).then(
        async (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                stores.push( {...doc.data(), id: doc.id} )
            });
            if(stores.length > 0){
                await updateDoc(doc(db, userDb, superDoc, collectionRef, stores[0].id), {
                    Uses: increment(1)
                });

            } else {
                let data = {
                    Name: store,
                    Uses: 1
                }
                await addDoc(colRef, data) 
            }
        }
    )
}