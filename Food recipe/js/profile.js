import * as db from './db.js';
//<input type="text" class="form-control" id="exampleFormControlInput2"></input>

loadUserProfile();

async function loadUserProfile() {
    const uid = sessionStorage.getItem("userID");
    let user = await db.getDocument(uid, "users");

    if (user != null) {
        let ingredients = user.ingredients;
        let equipment = user.equipment;
        let restrictions = user.restrictions;

        // INGREDIENTS - VIRTUAL FRIDGE
        for (const key in ingredients) {
            addIngredient(ingredients[key]);
        }

        // EQUIPMENT
        for (const key in equipment) {
            addEquipment(equipment[key]);
        }

        // RESTRICTIONS
        let diets = document.getElementById("search-diet");
        if (diets != null) {
            for (var i = 0; i < diets.options.length; i++) {
                diets.options[i].selected = restrictions.indexOf(diets.options[i].value) >= 0;
            }
        }
        

    } else {
        alert("Unable to load user to page");
        window.location.href = '/index.html';
    }
}

window.addIngredient = async function displayNewIngredient() {
    addIngredient();
}

window.addEquipment = async function displayNewEquipment() {
    addEquipment();
}

async function addIngredient(value = "") {
    const target = document.getElementById("ingredients-list");
    const index = target.childElementCount;

    let control = document.createElement("input")
    control.setAttribute("type", "text");
    control.className = "form-control";
    control.id = "ingredient-" + index
    if (value.length > 0) {
        control.value = value;
    } else {
        control.placeholder = "Enter ingredient";
    }
    target.appendChild(control);
}

async function addEquipment(value = "") {
    const target = document.getElementById("equipment-list");
    const index = target.childElementCount;

    let control = document.createElement("input")
    control.setAttribute("type", "text");
    control.className = "form-control";
    control.id = "equipment-" + index
    if (value.length > 0) {
        control.value = value;
    } else {
        control.placeholder = "Enter equipment";
    }
    target.appendChild(control);
}

window.saveUserProfile = async function saveUserProfile() {
    const uid = sessionStorage.getItem("userID");
    let user = await db.getDocument(uid, "users");

    if (user != null) {
        // INGREDIENTS - VIRTUAL FRIDGE
        const ingredients_el = document.getElementById("ingredients-list");
        const ingredients = Array.from(ingredients_el.children).map(ingredient => ingredient.value).filter(value => value.length > 0);
        user = {...user, ingredients};

        // EQUIPMENT
        const equipment_el = document.getElementById("equipment-list");
        const equipment = Array.from(equipment_el.children).map(equipment => equipment.value).filter(value => value.length > 0);
        user = {...user, equipment};

        // RESTRICTIONS
        const diets_el = document.getElementById("search-diet");
        const restrictions = Array.from(diets_el.options).filter(option => option.selected).map(option => option.value);
        user = {...user, restrictions};
        
         // Write updated user object back to db
         db.editDocumentWithId(uid,"users",user);
         alert("User profile updated!")
         //window.location.href = '/home.html';
        
    } else {
        alert("Unable to load user to page");
        window.location.href = '/index.html';
    }
}