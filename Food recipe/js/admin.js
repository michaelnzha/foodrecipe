import * as db from './db.js';
//import { getFirestore, collection, writeBatch, addDoc, doc, getDoc, setDoc, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

export async function hideAdminOptions(userID) {
    
    const adminOptions = document.querySelector("#admin-options");
    //const adminStatus = await sessionStorage.getItem("admin");
    let adminStatus = await getAdminStatus(userID);
    //console.log("admin:", adminStatus);

    if (adminStatus == true) {
        //console.log(adminStatus);
        adminOptions.style.display = "block";
    }
}

async function getAdminStatus(userID) {
    let userData = await db.getDocument(userID, "users");
    //const docRef = doc(db, "users", userID);
    //const docSnap = await getDoc(docRef);
    //console.log(userData.admin);

    return userData.admin;
}

if (window.sessionStorage.getItem("userID") != null) {
    hideAdminOptions(window.sessionStorage.getItem("userID"));
}

const signoutBtn = document.querySelector("#signoutBtn");
// when signout button exists on page, add event listener on click to call signout function
if (signoutBtn != null) {
    signoutBtn.addEventListener("click", signOut);
}

/*
* On signout, clear session storage and redirect to landing page
*/
function signOut() {
    sessionStorage.clear();
    window.location.replace("index.html");
}