import * as db from './db.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = decodeURI(urlParams.get('id'))

const userID = sessionStorage.getItem("userID");

const userDocRef = db.doc(db.getDB(), "users", userID);
const userDocSnap = await db.getDoc(userDocRef);

const results_div = document.getElementById("results");

if (userID != "") {
    displayAllRecipes();
}

async function displayAllRecipes() {
    let displayTitle = document.getElementById("displayAll-title");
    displayTitle.innerHTML = id;

    if (id == "Recent Recipes") {
        displayAllRecent();
    } else if (id == "Favourite Recipes") {
        displayAllFav();
    } else if (id == "Featured Recipes") {
        displayAllFeatured();
    }
}

async function displayAllRecent() {
    
    let results = userDocSnap.data().recentRecipes;

    if(results.length > 0) {
        results.forEach(recipe => displayRecipeCard(results_div,recipe)) 
    } else {
        const p = document.createElement("p");
        p.textContent = "No results found";
        results_div.appendChild(p);
    }
}

async function displayAllFav() {
    let results = userDocSnap.data().favRecipes;

    if(results.length > 0) {
        results.forEach(recipe => displayRecipeCard(results_div,recipe)) 
    } else {
        const p = document.createElement("p");
        p.textContent = "No results found";
        results_div.appendChild(p);
    }
}

async function displayAllFeatured() {

    let results = [];

    const allFeaturedRecipesSnapshot = await db.getDocs(db.collection(db.getDB(), "featuredRecipes"));
    allFeaturedRecipesSnapshot.forEach(async (doc) => {
        results.push(doc.id);
    });

    if(results.length > 0) {
        results.forEach(recipe => displayRecipeCard(results_div,recipe)) 
    } else {
        const p = document.createElement("p");
        p.textContent = "No results found";
        results_div.appendChild(p);
    }

}

export async function displayRecipeCard(element, recipe) {

    const recipeDocRef = db.doc(db.getDB(), "recipes", recipe);
    const recipeDocSnap = await db.getDoc(recipeDocRef);

    let col = document.createElement("div")
    col.className = "col";
    element.appendChild(col);

    let card = document.createElement("div")
    card.className = "card";
    card.style.property = "width: 18rem;";
    col.appendChild(card);

    let img = document.createElement("img");
    img.src = recipeDocSnap.data().image;
    img.className = "card-img-top";
    card.appendChild(img);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    let name = document.createElement("h5");
    name.className = "card-title";
    name.innerText = recipeDocSnap.data().name;
    cardBody.appendChild(name);

    let views = document.createElement("p");
    views.className = "card-text";
    views.innerHTML = "Views: " + recipeDocSnap.data().views;
    cardBody.appendChild(views);

    const link = document.createElement("a");
    link.href = "/displayRecipe.html?id=" + encodeURI(recipeDocSnap.data().name);
    link.className = "btn btn-primary";
    link.innerHTML = "Go To Recipe";
    cardBody.appendChild(link);

}