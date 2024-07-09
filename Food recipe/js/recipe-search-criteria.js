const cuisinesList = [
    "african", 
    "chinese", 
    "japanese", 
    "korean", 
    "vietnamese", 
    "thai", 
    "indian", 
    "british", 
    "irish", 
    "french", 
    "italian", 
    "mexican", 
    "spanish", 
    "middle eastern", 
    "jewish", 
    "american", 
    "cajun", 
    "southern", 
    "greek", 
    "german", 
    "nordic", 
    "eastern european", 
    "caribbean", 
    "latin american",
    "mediterranean",
    "european",
    "asian"
].sort()

const dietsList = [
    "pescatarian",
    "gluten free",
    "dairy free",
    "lacto ovo vegetarian", 
    "whole 30", 
    "vegan", 
    "paleolithic", 
    "primal",
    "fodmap friendly"
].sort()

const dishTypesList = [
    "main course", 
    "side dish", 
    "dessert", 
    "appetizer", 
    "salad", 
    "bread", 
    "breakfast", 
    "soup", 
    "beverage", 
    "sauce",
    "drink"
].sort()

var cuisines = document.getElementById("search-cuisine");
if (cuisines != null) {
    for(let i = 0; i < cuisinesList.length; i++) {
        var opt = cuisinesList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        cuisines.appendChild(el);
    }
}

var diets = document.getElementById("search-diet");
if (diets != null) {
    for(let i = 0; i < dietsList.length; i++) {
        var opt = dietsList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        diets.appendChild(el);
    }
}

var dishTypes = document.getElementById("search-dishtype");
if (dishTypes != null) {
    for(let i = 0; i < dishTypesList.length; i++) {
        var opt = dishTypesList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dishTypes.appendChild(el);
    }
}