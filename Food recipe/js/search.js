import * as db from './db.js';

/*window.getRecipe = async function getRecipe(recipe_id) {
    getDocument (recipe_id, "recipes");
}*/

window.getRecipes = async function getRecipes(target) {
    const query = document.getElementById("search-query").value.split(/[, ]+/).filter(e => e !== '');
    const cuisines = Array.from(document.getElementById("search-cuisine").options).filter(option => option.selected).map(option => option.value);
    const types = Array.from(document.getElementById("search-dishtype").options).filter(option => option.selected).map(option => option.value);
    let equipment = document.getElementById("search-equipment").value.split(',').filter(e => e !== '');
    let ingredients = document.getElementById("search-ingredient").value.split(',').filter(e => e !== '');
    let diets = Array.from(document.getElementById("search-diet").options).filter(option => option.selected).map(option => option.value);
    
    //PROFILE INCLUSIONS
    const uid = sessionStorage.getItem("userID");
    let user = await db.getDocument(uid, "users");

    if (user != null) {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        if (document.getElementById("profile-ingredients").checked) {
            ingredients = ingredients.concat(user.ingredients).filter(onlyUnique);
        }
        if (document.getElementById("profile-equipment").checked) {
            equipment = equipment.concat(user.equipment).filter(onlyUnique);
        }
        if (document.getElementById("profile-restrictions").checked) {
            diets = diets.concat(user.restrictions).filter(onlyUnique);
        }

    } else {
        console.log("Unable to load user on search page");
    }

    //SEARCH
    const search = {
        name: await cleanseTerms(query),
        cuisines: await cleanseTerms(cuisines),
        diets: await cleanseTerms(diets),
        dishTypes: await cleanseTerms(types),
        equipment: await cleanseTerms(equipment),
        ingredients: await cleanseTerms(ingredients)
    };

    const col = await db.getDocumentsCollection("recipes");
    const results = await filterDocumentsCollection(search, col);

    document.getElementById("results-title").style.display = 'block';

    const results_div = document.getElementById("results");
    results_div.replaceChildren();//clear results after search

    if(results.length > 0) {
        results.forEach(recipe => displayRecipeCard(target,recipe)) 
    } else {
        const p = document.createElement("p");
        p.textContent = "No results found";
        results_div.appendChild(p);
    }
    
}

async function filterDocumentsCollection(search, docs) {
    docs = docs.map( doc => doc.data());

    let arr_contains = (arr, target) => target.every(v => arr.includes(v.trim().toLowerCase()));

    // Loop through search criteria, for each, filter docs collection by those that contain all criteria of the type
    for (let field in search) {
        const key = field;
        const value_array = search[field];

        logSearchStats(key, value_array);
        
        docs = docs.filter( doc => {
            
            let doc_val = doc[key];
            if (doc !== undefined && doc_val !== undefined) {
                if(Array.isArray(doc_val)) {
                    doc_val = doc_val.filter(e => e !== null); //Remove nulls from recipe values
                    return arr_contains(doc_val.map(val => val.trim().toLowerCase()), value_array);
                } else {
                    return arr_contains(doc_val.trim().toLowerCase().split(/[\s,]+/).filter(e => e !== ''), value_array);
                }
            } else {
                return false;
            }
        })
    }

    return docs
}

async function displayRecipeCard(element, recipe) {

    const target = document.getElementById(element);
    const index = target.childElementCount;

    let col = document.createElement("div")
    col.className = "col";
    target.appendChild(col);

    let card = document.createElement("div")
    card.className = "card";
    card.style.property = "width: 18rem;";
    col.appendChild(card);

    let img = document.createElement("img");
    img.src = recipe.image;
    img.className = "card-img-top";
    card.appendChild(img);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    let name = document.createElement("h5");
    name.className = "card-title";
    name.innerText = recipe.name;
    cardBody.appendChild(name);

    let views = document.createElement("p");
    views.className = "card-text";
    views.innerHTML = "Views: " + recipe.views;
    cardBody.appendChild(views);

    const link = document.createElement("a");
    link.id = "cardButton-" + index;
    link.href = "/displayRecipe.html?id=" + encodeURI(recipe.name);
    link.className = "btn btn-primary";
    link.innerHTML = "Go To Recipe";
    cardBody.appendChild(link);

}

async function cleanseTerms(value_array) {
    const stop_words = ['a', 'an', 'the', 'and', 'it', 'for', 'or', 'but', 'in', 'my', 'your', 'our', 'their', 'with', 'on' ];

    if (value_array != null && value_array.length > 0) {
        const terms = value_array.filter( term => !stop_words.includes(term) ).map( term => term.trim().toLowerCase());
        return (terms == null) ? [] : terms;
    } else {
        return [];
    }
}

async function logSearchStats(key, value_array) {

    if (value_array.length > 0) {
        for (const index in value_array) {
            // Filter by term
            const term = value_array[index];
            let docs = await db.getDocumentsByQuery("searchTerms","term", term.toLowerCase());
            docs = docs.map( doc => { 
                const data = doc.data();
                data.id = doc.id;
                return data;
            })

            // Filter by term type
            docs = docs.filter( doc => doc.type.toLowerCase() == key.toLowerCase());

            // If there is a result, then
            if (docs.length >= 1) {
                // Increment term count
                let term_doc = docs[0];
                const id = term_doc.id;
                const count = term_doc.count + 1;
                term_doc = {...term_doc, count};
                delete term_doc.id;
                await db.editDocumentWithId(id,"searchTerms",term_doc);
            } else {
                // Create new term tracker
                await db.createDocument("searchTerms", {
                    count: 1,
                    type: key.toLowerCase(),
                    term: term.toLowerCase()
                });
            }

        }
    }

}