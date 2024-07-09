import * as dbModule from './db.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, collection, writeBatch, addDoc, doc, getDoc, setDoc, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
//import { getDatabase, ref, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
//import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
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
const db = getFirestore(app);

const signupbtn = document.querySelector("#signup-submit-btn");
const signUpForm = document.querySelector("#signupForm");

//When there is a signupform on the page, add an event listener for form submission
if (signUpForm != null) {
    signUpForm.addEventListener("submit", addUser);
}

/*
* Add a new account to the accounts collection, called when signupform is submitted
*/
async function addUser() {
    event.preventDefault();
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const uname = document.getElementById("signup-uname").value;
    const email = document.getElementById("email").value;
    const pwd1 = document.getElementById("signup-pwd1").value;
    const pwd2 = document.getElementById("signup-pwd2").value;

    //length validation for password
    //check pwd1 matches pwd2

    let condition = await checkUnameUnique(uname) && await checkEmailUnique(email) && await validatePassword(pwd1, pwd2);
    if (condition) {
        try {
            // REFERENCE: DO A WRITE TO FIRESTORE COLLECTION
            const docRef = await addDoc(collection(db, "users"), {
                fname: fname,
                lname: lname,
                username: uname,
                email: email,
                pwd: pwd1,
                admin: false,
                banned: false,
                favRecipes: [],
                recentRecipes: [],
                equipment: [],
                ingredients: [],
                restrictions: [],
            });

            sessionStorage.setItem("username", uname);
            sessionStorage.setItem("admin", docRef.admin);
            sessionStorage.setItem("userID", docRef.id);

            //console output to verify it works, delete later
            //console.log("Document written with ID: ", docRef.id);

            //Redirect to home page
            window.location.replace("home.html");
        } catch (event) {
            console.error("Error adding document: ", event);
        };
    }
}

/*
* Returns false when the username given exists in the users collection
*/
async function checkUnameUnique(uname) {
    const usernames = [];
    //loop through each document in users collection and save usernames in an array
    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data().username);
        usernames.push(doc.data().username);
    });

    let unameAlert = document.getElementById("signup-uname-alert");
    unameAlert.style.display = "none";

    let uLen = usernames.length;
    for (let i = 0; i < uLen; i++) {
        if (usernames[i] == uname) {
            unameAlert.innerText = "This username already exists. Please choose a different username.";
            unameAlert.style.display = "block";
            return false;
        }
    }
    return true;
};

/*
* Returns false when the email given exists in the users collection
*/
async function checkEmailUnique(email) {
    const emails = [];
    //loop through each document in users collection and save usernames in an array
    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data().username);
        emails.push(doc.data().email);
    });

    let emailAlert = document.getElementById("signup-email-alert");
    emailAlert.style.display = "none";

    let eLen = emails.length;
    for (let i = 0; i < eLen; i++) {
        if (emails[i] == email) {
            emailAlert.innerText = "This email already exists. Please choose a different email.";
            emailAlert.style.display = "block";
            return false;
        }
    }
    return true;
};

function validatePassword(pwd1, pwd2) {
    let pwdAlert = document.getElementById("signup-pwd-alert");
    pwdAlert.style.display = "none";
    if ((pwd1 != pwd2)) {
        pwdAlert.innerText = "The passwords entered do not match.";
        pwdAlert.style.display = "block";
        return false;
    }
    if (pwd1.length < 8) {
        pwdAlert.innerText = "The password must be greater than 8 characters.";
        pwdAlert.style.display = "block";
        return false;
    }
    return true;
}

const loginbtn = document.querySelector("#login-submit-btn");
const loginForm = document.querySelector("#loginForm");
//When there is a loginform on the page, add an event listener for form submission
if (loginForm != null) {
    loginForm.addEventListener("submit", login);
}

/*
* On login, authenticate values passed into form, save session info, and redirect to homepage
*/
async function login() {
    event.preventDefault();
    const uname = document.getElementById("login-uname").value;
    const pwd = document.getElementById("login-pwd").value;
    let userID = await authenticateLogin(uname, pwd);

    if (userID != "null") {
        sessionStorage.setItem("username", uname);
        sessionStorage.setItem("userID", userID);
        window.location.replace("home.html");
    } else {
        let alert = document.getElementById("login-alert");
        alert.innerHTML = "Invalid Credentials. Please enter a valid combination.";
        alert.style.display = "block";
        //console.log(uname, pwd, "invalid credentials");
    }
}

/*
* Authenticate that the username and password passed in are a matching pair
* Return the user id of that matching pair from the users collection
*/
async function authenticateLogin(uname, pwd) {
    const userIDs = [];
    const usernames = [];
    const passwords = [];
    //loop through each document in users collection and save usernames in an array
    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        userIDs.push(doc.id);
        usernames.push(doc.data().username);
        passwords.push(doc.data().pwd);
    });
    let uLen = usernames.length;
    for (let i = 0; i < uLen; i++) {
        if (usernames[i] == uname && passwords[i] == pwd) {
            return userIDs[i];
        }
    }
    return "null";
}
