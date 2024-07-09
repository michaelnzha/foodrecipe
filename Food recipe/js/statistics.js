import * as db from './db.js';

loadStatistics();

async function loadStatistics() {
    topQueryTerms();
    topCuisineTerms();
    topIngredientTerms()
    mostViewedRecipes();
    //topRecipes();
    //worstRecipes();
}

async function topQueryTerms() {
    let docs = await db.getDocumentsByOrderAndLimit("searchTerms", "count","desc",100);
    docs = docs.map( doc => doc.data());
    docs = docs.filter( doc => doc.type == 'name');
    let terms = docs.sort((a,b) => b.count - a.count);
    addListText("top-terms",terms);
}

async function topCuisineTerms() {
    let docs = await db.getDocumentsByOrderAndLimit("searchTerms", "count","desc",100);
    docs = docs.map( doc => doc.data());
    docs = docs.filter( doc => doc.type == 'cuisines');
    let terms = docs.sort((a,b) => b.count - a.count);
    addListText("top-cuisines",terms);
}

async function topIngredientTerms() {
    let docs = await db.getDocumentsByOrderAndLimit("searchTerms", "count","desc",100);
    docs = docs.map( doc => doc.data());
    docs = docs.filter( doc => doc.type == 'ingredients');
    let terms = docs.sort((a,b) => b.count - a.count);
    addListText("top-ingredients",terms);
}

async function mostViewedRecipes() {
    let docs = await db.getDocumentsByOrderAndLimit("recipes", "views","desc",10);
    docs = docs.map( doc => doc.data());
    addListRecipe("most-viewed-recipes",docs);
}


async function addListText(element, terms_array) {
    const target = document.getElementById(element);
    target.replaceChildren();

    for (const key in terms_array) {
        const term = terms_array[key];

        let control = document.createElement("p");
        control.className = "mb-4 f400";
        control.innerHTML = term.count + " - " + term.term;
        target.appendChild(control);
    }
    
}

async function addListRecipe(element, recipe_array) {
    const target = document.getElementById(element);
    target.replaceChildren();

    for (const key in recipe_array) {
        const recipe = recipe_array[key];

        let p = document.createElement("p");
        p.className = "mb-4 f400";
        target.appendChild(p);

        let control = document.createElement("a");
        control.href = "/displayRecipe.html?id=" + encodeURI(recipe.name);
        control.innerHTML = recipe.views + " - " + recipe.name;
        p.appendChild(control);
    }
    
}

//link.href = "/displayRecipe.html?id=" + encodeURI(recipe.name);