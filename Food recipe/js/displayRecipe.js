import * as db from './db.js';
//import { getFirestore, collection, writeBatch, addDoc, doc, getDoc, setDoc, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import * as admin from './admin.js';

async function displayRecipePage() {
    let recipe = await db.getDocument(recipeID, "recipes");

    let buttonState = await checkFavourite(recipeID);
    let favButton = document.getElementById("recipe-fav-button");
    let favIcon = document.createElement("i");
    favIcon.className = "bi bi-bookmark-heart";
    if (buttonState) {
        favButton.innerHTML = "Unfavourite ";
        favButton.appendChild(favIcon);
    } else {
        favButton.innerHTML = "Favourite ";
        favButton.appendChild(favIcon);
    }

    let name = document.getElementById("recipeName");
    name.innerHTML = recipe.name;
    let image = document.getElementById("recipeImage");
    image.src = recipe.image;
    let cookingTime = document.getElementById("recipeCookingMinutes");
    cookingTime.innerHTML = "Cooking Minutes: " + recipe.cookingMinutes;
    let diets = document.getElementById("recipeDiets");
    let getDiets = recipe.diets;
    // in case no diets to display
    if (getDiets.length > 0) {
        document.getElementById("dietDisplay").style.display = "block";
    }
    //console.log(recipe, getDiets);
    for (let i = 0; i < getDiets.length; i++) {
        let dietItem = document.createElement("li");
        dietItem.innerHTML = getDiets[i];
        diets.appendChild(dietItem);
    }
    let ingredients = document.getElementById("recipeIngredients");
    let getIngredients = recipe.ingredients_label;
    for (let i = 0; i < getIngredients.length; i++) {
        let ingredientItem = document.createElement("li");
        ingredientItem.innerHTML = getIngredients[i];
        ingredients.appendChild(ingredientItem);
    }
    let summary = document.getElementById("recipeSummary");
    summary.innerHTML = recipe.summary;
    let instructions = document.getElementById("recipeInstructions");
    let getInstructions = recipe.instructions;
    for (let i = 0; i < getInstructions.length; i++) {
        let instructionItem = document.createElement("li");
        instructionItem.innerHTML = getInstructions[i];
        instructions.appendChild(instructionItem);
        let space = document.createElement("br");
        instructions.appendChild(space);
    }
    let viewCount = document.getElementById("viewCount");
    viewCount.innerHTML = "Views: " + recipe.views;
    let upvotes = document.getElementById("upvotes");
    upvotes.innerHTML = "Upvotes: " + await getUpVotes();
    let downvotes = document.getElementById("downvotes");
    downvotes.innerHTML = "Downvotes: " + await getDownVotes();
}

const userID = sessionStorage.getItem("userID");

if (userID != "null") {
    admin.hideAdminOptions(sessionStorage.getItem("userID"));
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = decodeURI(urlParams.get('id'))
const recipeName = id;
const recipeID = recipeName.toLowerCase();

const recipeDocRef = db.doc(db.getDB(), "recipes", recipeID);
const recipeDocSnap = await db.getDoc(recipeDocRef);

const userDocRef = db.doc(db.getDB(), "users", userID);
const userDocSnap = await db.getDoc(userDocRef);

const reviewsSnapshot = await db.getDocs(db.collection(db.getDB(), "reviews"));


if (recipeID != "") {
    displayRecipePage();
    addToRecentRecipes();
    incrementViewCount()
}

async function getUpVotes() {
    let count = 0;
    reviewsSnapshot.forEach((doc) => {
        if ((recipeName == doc.data().recipe) && (doc.data().sentiment)) {
            count++;
        }
    });
    return count;
}

async function getDownVotes() {
    let count = 0;
    reviewsSnapshot.forEach((doc) => {
        if ((recipeName == doc.data().recipe) && !(doc.data().sentiment)) {
            count++;
        }
    });
    return count;
}

async function checkFavourite() {
    let getFavRecipes = userDocSnap.data().favRecipes;
    let exists = false;
    for (let i = 0; i < getFavRecipes.length; i++) {
        if (getFavRecipes[i] == recipeID) {
            exists = true;
        }
    }
    return exists;
}

//add or remove from favourites function

document.body.addEventListener('click', function (event) {
    if (event.target.id == 'recipe-fav-button') {
        addRemoveFav();
    }
});

async function addRemoveFav() {
    if (await checkFavourite()) {
        await db.updateDoc(userDocRef, {
            favRecipes: db.arrayRemove(recipeID)
        });
    } else {
        await db.updateDoc(userDocRef, {
            favRecipes: db.arrayUnion(recipeID)
        });
    }
    location.reload();
}

async function addToRecentRecipes() {
    let getRecentRecipes = userDocSnap.data().recentRecipes;
    let exists = false;
    for (let i = 0; i < getRecentRecipes.length; i++) {
        if (getRecentRecipes[i] == recipeID) {
            exists = true;
        }
    }
    if (exists) {
        await db.updateDoc(userDocRef, {
            recentRecipes: db.arrayRemove(recipeID)
        });
        await db.updateDoc(userDocRef, {
            recentRecipes: db.arrayUnion(recipeID)
        });
    } else {
        await db.updateDoc(userDocRef, {
            recentRecipes: db.arrayUnion(recipeID)
        });
    }
}

async function incrementViewCount() {
    let getRecentRecipes = userDocSnap.data().recentRecipes;
    let exists = false;
    for (let i = 0; i < getRecentRecipes.length; i++) {
        if (getRecentRecipes[i] == recipeID) {
            exists = true;
        }
    }
    console.log(exists);
    console.log(!exists);
    let newViewCount = recipeDocSnap.data().views + 1;
    console.log(newViewCount);
    if (!exists) {
        await db.updateDoc(recipeDocRef, {
            views: newViewCount
        });
    }
}