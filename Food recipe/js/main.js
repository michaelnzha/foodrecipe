//import * as display from './displayRecipe.js';
import * as admin from './admin.js';

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

/* ----------------------------------------------------------------------------------------------- */
// home.html
/* ----------------------------------------------------------------------------------------------- */

displayAllHomePageRecipes();

const recentViewMoreBtn = document.querySelector("#recentRecipes-more-btn");
recentViewMoreBtn.addEventListener("click", redirectDisplayAllRecent);

function redirectDisplayAllRecent() {
    let url = "/displayAll.html?id=" + encodeURI("Recent Recipes");
    window.location.assign(url);
}

const favViewMoreBtn = document.querySelector("#favRecipes-more-btn");
favViewMoreBtn.addEventListener("click", redirectDisplayAllFav);

function redirectDisplayAllFav() {
    let url = "/displayAll.html?id=" + encodeURI("Favourite Recipes");
    window.location.assign(url);
}

const featuredViewMoreBtn = document.querySelector("#featuredRecipes-more-btn");
featuredViewMoreBtn.addEventListener("click", redirectDisplayAllFeatured);

function redirectDisplayAllFeatured() {
    let url = "/displayAll.html?id=" + encodeURI("Featured Recipes");
    window.location.assign(url);
}

/*
* Display recipe previews on homepage,
* called, when current page is the homepage
*/
async function displayAllHomePageRecipes() {
    displayThreeRecentRecipes();
    displayFavThreeRecipes();
    displayThreeFeaturedRecipes();
}

/*
* Displays a recipe as a bootstrap card
* takes the target html element where card should be inserted and recipeID of recipe that should be displayed
*/
async function displayRecipe(target, recipeID) {

    const docRef = doc(db, "recipes", recipeID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        let card = document.createElement("div")
        card.className = "card";
        card.style.property = "width: 18rem;";
        target.appendChild(card);

        let img = document.createElement("img");
        img.src = docSnap.data().image;
        img.className = "card-img-top";
        card.appendChild(img);

        let cardBody = document.createElement("div");
        cardBody.className = "card-body";
        card.appendChild(cardBody);

        let name = document.createElement("h5");
        name.className = "card-title";
        name.innerText = docSnap.data().name;
        cardBody.appendChild(name);

        let views = document.createElement("p");
        views.className = "card-text";
        views.innerHTML = "Views: " + docSnap.data().views;
        cardBody.appendChild(views);

        let link = document.createElement("a");
        link.id = "cardButton";
        link.href = "/displayRecipe.html?id=" + encodeURI(docSnap.data().name);
        link.className = "btn btn-primary";
        link.innerHTML = "Go To Recipe";
        cardBody.appendChild(link);

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

}

/*
* Display 3 most recently viewed recipes
*/
async function displayThreeRecentRecipes() {

    const recentThreeRecipes = await getThreeRecentRecipes();
    const recentThreeRecipesLength = recentThreeRecipes.length;

    let recentRecipeTargets = [
        document.getElementById("recentRecipes-one"),
        document.getElementById("recentRecipes-two"),
        document.getElementById("recentRecipes-three")
    ];

    if (recentThreeRecipesLength == 0) {
        let hideTarget = document.getElementById("recentRecipesRow");
        hideTarget.style.display = "none";
        let message = document.createElement("h4");
        message.innerHTML = "You have not recently viewed any recipes.";
        let addTarget = document.getElementById("recentRecipes");
        addTarget.appendChild(message);
    } else {
        for (let i = 0; i < recentThreeRecipesLength; i++) {
            //favRecipeTargets[i].style.display = "block";
            displayRecipe(recentRecipeTargets[i], recentThreeRecipes[i]);
        }
    }
}

/*
* Get 3 most recently viewed recipes
*/
async function getThreeRecentRecipes() {

    let userID = sessionStorage.getItem("userID");
    let returnRecipes = [];

    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    //get all favRecipes array from user
    const allRecentRecipes = docSnap.data().recentRecipes;

    let allRecentRecipesLength = allRecentRecipes.length;
    let lastRecipe = allRecentRecipesLength - 1;
    const maxRecipesReturn = 3;

    //loop through each recipe, saving only the last three recently added to array
    for (let i = lastRecipe; i > lastRecipe - maxRecipesReturn; i--) {
        if (allRecentRecipes[i] != null) {
            returnRecipes.push(allRecentRecipes[i]);
        } else {
            break;
        }
    }

    return returnRecipes;
}

/*
* Display 3 most recently favourited recipes
*/
async function displayFavThreeRecipes() {

    const favThreeRecipes = await getThreeFavRecipes();
    const favThreeRecipesLength = favThreeRecipes.length;

    let favRecipeTargets = [
        document.getElementById("favRecipes-one"),
        document.getElementById("favRecipes-two"),
        document.getElementById("favRecipes-three")];

    if (favThreeRecipesLength == 0) {
        let hideTarget = document.getElementById("favRecipesRow");
        hideTarget.style.display = "none";
        let message = document.createElement("h4");
        message.innerHTML = "You have not favourited any recipes.";
        let addTarget = document.getElementById("favRecipes");
        addTarget.appendChild(message);
    } else {
        for (let i = 0; i < favThreeRecipesLength; i++) {
            displayRecipe(favRecipeTargets[i], favThreeRecipes[i]);
        }
    }
}

/*
* Returns the 3 most recently favourited recipes by the user
* UPDATE: session user id - done
*/
async function getThreeFavRecipes() {

    let userID = sessionStorage.getItem("userID");
    let returnRecipes = [];

    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    //get all favRecipes array from user
    const allFavRecipes = docSnap.data().favRecipes;

    let allFavRecipesLength = allFavRecipes.length;
    let lastRecipe = allFavRecipesLength - 1;
    const maxRecipesReturn = 3;

    //loop through each recipe, saving only the last three recently added to array
    for (let i = lastRecipe; i > lastRecipe - maxRecipesReturn; i--) {
        if (allFavRecipes[i] != null) {
            returnRecipes.push(allFavRecipes[i]);
        } else {
            break;
        }
    }

    return returnRecipes;
}

/*
* Display 3 most viewed featured recipes
*/
async function displayThreeFeaturedRecipes() {

    const featuredThreeRecipes = await getThreeFeaturedRecipes();
    const featuredThreeRecipesLength = 3;

    let featuredRecipeTargets = [
        document.getElementById("featuredRecipes-one"),
        document.getElementById("featuredRecipes-two"),
        document.getElementById("featuredRecipes-three")
    ];

    for (let i = 0; i < featuredThreeRecipesLength; i++) {
        displayRecipe(featuredRecipeTargets[i], featuredThreeRecipes[i]);
    }
}

/*
* Returns the 3 most viewed featured recipes
*/
async function getThreeFeaturedRecipes() {

    let allRecipes = [];
    let allFeaturedRecipes = [];
    let returnRecipes = [];


    const recipesRef = collection(db, "recipes");
    const q = query(recipesRef, orderBy("views", "desc"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allRecipes.push(doc.id);
    });

    const allFeaturedRecipesSnapshot = await getDocs(collection(db, "featuredRecipes"));
    allFeaturedRecipesSnapshot.forEach(async (doc) => {
        allFeaturedRecipes.push(doc.id);
    });


    for (let i = 0; i < allRecipes.length; i++) {
        for (let j = 0; j < allFeaturedRecipes.length; j++) {
            if (returnRecipes.length == 3) {
                break;
            }
            if (allFeaturedRecipes[j] == allRecipes[i]) {
                returnRecipes.push(allFeaturedRecipes[j]);
            }
        }
    }

    return returnRecipes;
}