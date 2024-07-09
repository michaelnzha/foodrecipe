import * as db from './db.js';

//LOAD RECIPE IF URL PARAM
const id = await isURLParamPresent();
if (id != 'null') {
    loadRecipe(id);
}


//LOAD
async function loadRecipe(recipe_id) {
    let recipe = await db.getDocument(recipe_id.toLowerCase(), "recipes");

    if (recipe != null) {

        // NAME
        let name = document.getElementById("recipe-name");
        name.value = recipe.name;
        name.disabled = true;

        // SUMMARY
        let summary = document.getElementById("recipe-summary");
        summary.value = recipe.summary;

        // PREP MINUTES
        let preparationMinutes = document.getElementById("recipe-preptime");
        preparationMinutes.value = recipe.preparationMinutes;

        // COOK MINUTES
        let cookingMinutes = document.getElementById("recipe-cooktime");
        cookingMinutes.value = recipe.cookingMinutes;

        // CUISINES
        let cuisines = document.getElementById("search-cuisine");
        if (cuisines != null) {
            for (var i = 0; i < cuisines.options.length; i++) {
                cuisines.options[i].selected = 
                    (recipe.cuisines.indexOf(cuisines.options[i].value) >= 0) || (recipe.cuisines.indexOf(toTitleCase(cuisines.options[i].value)) >= 0);
            }
        }

        // DIETS
        let diets = document.getElementById("search-diet");
        if (diets != null) {
            for (var i = 0; i < diets.options.length; i++) {
                diets.options[i].selected = recipe.diets.indexOf(diets.options[i].value) >= 0;
            }
        }

        // DISH TYPES
        let dishTypes = document.getElementById("search-dishtype");
        if (dishTypes != null) {
            for (var i = 0; i < dishTypes.options.length; i++) {
                dishTypes.options[i].selected = recipe.dishTypes.indexOf(dishTypes.options[i].value) >= 0;
            }
        }

        // INGREDIENTS
        document.getElementById("ingredients-list").replaceChildren();
        for (const key in recipe.ingredients) {
            addListItem("ingredients-list", "ingredient", "Enter ingredient", recipe.ingredients[key]);
        }

        // INSTRUCTIONS
        document.getElementById("instructions-list").replaceChildren();
        for (const key in recipe.instructions) {
            addListItem("instructions-list", "instruction", "Enter step", recipe.instructions[key]);
        }

        // EQUIPMENT
        document.getElementById("equipment-list").replaceChildren();
        for (const key in recipe.equipment) {
            addListItem("equipment-list", "equipment", "Enter equipment", recipe.equipment[key]);
        }    

    } else {
        alert("Unable to load recipe to page");
        window.location.href = '/manage-recipes.html';
    }
}


//SAVE
window.saveRecipe = async function saveRecipeCaller() {
    saveRecipe();
}

async function saveRecipe() {
    const name = document.getElementById("recipe-name").value;
    const summary = document.getElementById("recipe-summary").value;
    let preparationMinutes = document.getElementById("recipe-preptime").value;
    let cookingMinutes = document.getElementById("recipe-cooktime").value;
    const cuisines = Array.from(document.getElementById("search-cuisine").options).filter(option => option.selected).map(option => toTitleCase(option.value));
    const diets = Array.from(document.getElementById("search-diet").options).filter(option => option.selected).map(option => option.value);
    const dishTypes = Array.from(document.getElementById("search-dishtype").options).filter(option => option.selected).map(option => option.value);
    const ingredients_label = Array.from(document.getElementById("ingredients-list").children).map(i => i.value).filter(value => value.length > 0);
    const instructions = Array.from(document.getElementById("instructions-list").children).map(i => i.value).filter(value => value.length > 0);
    const equipment = Array.from(document.getElementById("equipment-list").children).map(i => i.value).filter(value => value.length > 0);
    
    const id = await isURLParamPresent();

    //EDIT
    if (id != null) {
        const recipe_id = id.toLowerCase();
        let recipe = await db.getDocument(recipe_id.toLowerCase(), "recipes");

        if (recipe != null) {
            recipe = {...recipe, name};
            recipe = {...recipe, summary};

            if (!isNaN(preparationMinutes)) {
                preparationMinutes = preparationMinutes * 1;
                recipe = {...recipe, preparationMinutes};
            } else {
                alert("Prep Time is not a number");
            }

            if (!isNaN(cookingMinutes)) {
                cookingMinutes = cookingMinutes * 1;
                recipe = {...recipe, cookingMinutes};
            } else {
                alert("Cook Time is not a number");
            }

            recipe = {...recipe, cuisines};
            recipe = {...recipe, diets};
            recipe = {...recipe, dishTypes};
            recipe = {...recipe, ingredients_label};
            recipe = {...recipe, instructions};
            recipe = {...recipe, equipment};

            
            // Write updated recipe object back to db
            alert(await db.editDocumentWithId(recipe_id,"recipes",recipe));
            location.reload();
            
        } else {
            alert("Unable to load recipe to page. Please double check the id URL parameter value.");
        }
    } 
    //CREATE
    else {
        alert(
            await db.createDocumentWithId(name,"recipes", {
                name: name,
                id: "CUSTOM",
                sourceUrl: "CUSTOM",
                summary: summary,
                image: null,
                preparationMinutes: isNaN(preparationMinutes) ? null : preparationMinutes += 0,
                cookingMinutes: isNaN(cookingMinutes) ? null : cookingMinutes += 0,
                cuisines: cuisines,
                diets: diets,
                dishTypes: dishTypes,
                equipment: equipment,
                ingredients: ingredients_label,
                ingredients_label: ingredients_label,
                instructions: instructions,
                upvote: 0,
                downvote: 0,
                views: 0
        }));
        window.location.href = '/manage-recipes.html';
    }
}

// URL Param Check
async function isURLParamPresent() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = decodeURI(urlParams.get('id'));
    return id;
}

// UI Helpers
window.addIngredient = async function displayNewIngredient() {
    addListItem("ingredients-list", "ingredient", "Enter ingredient");
}

window.addInstruction = async function displayNewInstruction() {
    addListItem("instructions-list", "instruction", "Enter step");
}

window.addEquipment = async function displayNewEquipment() {
    addListItem("equipment-list", "equipment", "Enter equipment");
}

async function addListItem(element, idsign, placeholder_text, value = "") {
    const target = document.getElementById(element);
    const index = target.childElementCount;

    let control = document.createElement("input")
    control.setAttribute("type", "text");
    control.className = "form-control";
    control.id = idsign + "-" + index
    if (value.length > 0) {
        control.value = value;
    } else {
        control.placeholder = placeholder_text;
    }
    target.appendChild(control);
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }