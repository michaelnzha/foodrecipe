import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, initializeFirestore, collection, addDoc, doc, getDoc, setDoc, getDocs, query, where, deleteDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

export * from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
export * from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCMsmcwAbfuEaNfiXjzPeyggn06XA3ODA0",
    authDomain: "cps731-5460f.firebaseapp.com",
    projectId: "cps731-5460f",
    storageBucket: "cps731-5460f.appspot.com",
    messagingSenderId: "899072619275",
    appId: "1:899072619275:web:d127e0dab60255b98ca80e",
    measurementId: "G-GYV50J6C1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});
//const db = getFirestore(app);

//CREATE DOC - AUTO ID
export async function createDocument(col, data) {

    await addDoc(collection(db, col), data)
    .then(() => {
        console.log("Document has been added successfully");
    })
    .catch(error => {
        console.error("Error adding document: ", error);
    })
}

//CREATE DOC - CUSTOM ID
export async function createDocumentWithId(docid, col, data) {
    const document = await getDocument(docid, col);
    let msg = "";

    if (document == null || (col == "recipes" && document != null && document.id != data.id)) { //If document doesn't exist, or is a recipe with a newer recipe id, write doc

        await setDoc(doc(db, col, docid), data)
        .then(() => {
            msg = "Document " + docid + " has been added successfully to " + col;
            console.log(msg);
        })
        .catch(error => {
            console.error("Error adding document: ", error);
        });
        return msg;
    } else {
        msg = "Document with ID " + docid + " already exists in " + col + ". Skipped";
        console.log(msg);
        return msg;
    }
}

//EDIT DOC
export async function editDocumentWithId(docid, col, data) {
    const document = await getDocument(docid, col);
    let msg = "";

    if (document != null ) { //If document doesn't exist, or is a recipe with a newer recipe id, write doc

        await setDoc(doc(db, col, docid), data)
        .then(() => {
            msg = "Document " + docid + " has been updated successfully to " + col;
            console.log(msg);
        })
        .catch(error => {
            console.error("Error updating document: ", error);
        })
        return msg;

    } else {
        msg = "Document with ID " + docid + " does not exists in " + col + ". Skipped";
        console.log(msg);
        return msg;
    }
}

//GET DOC
export async function getDocument (docid, col) {
    const docRef = doc(db,col,docid);
    
    try {
        const docSnap = await getDoc(docRef);
        return (docSnap.exists ? docSnap.data() : null) 
    } catch(error) {
        console.log(error)
    }
}

export async function getDocumentsCollection (col) {
    const colRef = collection(db,col);
    
    try {
        const docsSnap = await getDocs(colRef);
        return (!docsSnap.empty ? docsSnap.docs : []) //TODO
    } catch(error) {
        console.log(error)
    }
}

export async function getDocumentsByQuery (col, key, value) {
    const colRef = collection(db,col);
    
    try {
        // Create a query against the collection.
        const q = query(colRef, where(key, "==", value));

        const docsSnap = await getDocs(q);
        return (!docsSnap.empty ? docsSnap.docs : []) //TODO
    } catch(error) {
        console.log(error)
    }
    
}

export async function getDocumentsByOrderAndLimit (col, key, direction, lim) {
    const colRef = collection(db,col);
    
    try {
        // Create a query against the collection.
        const q = query(colRef, orderBy(key, direction), limit(lim));

        const docsSnap = await getDocs(q);
        return (!docsSnap.empty ? docsSnap.docs : []) //TODO
    } catch(error) {
        console.log(error)
    }

    
}

// DELETE DOC
export async function deleteDocumentById(doc_id, col) {
    const docRef = doc(db, col, doc_id);
    let msg = "";

    try {
        await deleteDoc(docRef)
        .then(() => {
            msg = "Document " + doc_id + " has been deleted successfully from " + collection;
            console.log(msg);
        })
        .catch(error => {
            console.error("Error deleting document: ", error);
        });
        return msg;
    } catch(error) {
        console.log(error)
    }
    
}

// MISC Helpers

export function getDB () {
    return db;
}