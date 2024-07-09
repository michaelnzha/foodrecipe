import * as db from './db.js';

const API_BASE_URL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";
const API_KEY = "ba392765b5mshb7ef06c22cacd39p1bd9d0jsnba61d3a3b414";
const API_HOST = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";

const numberOfResults = 10; //CONTROLS HOW MANY RESULTS TO RETURN FROM THE API. MAX 100

let reqLim = 0;
let reqRem = 0;
let reqReset = 0;

let resLim = 0;
let resRem = 0;
let resReset = 0;

window.getRecipesAndSave = async function getRecipesAndSave() {
    const query = document.getElementById("search-query").value;
    const cuisines = Array.from(document.getElementById("search-cuisine").options).filter(option => option.selected).map(option => option.value);
    const diets = Array.from(document.getElementById("search-diet").options).filter(option => option.selected).map(option => option.value);
    const types = Array.from(document.getElementById("search-dishtype").options).filter(option => option.selected).map(option => option.value);
    const equipment = document.getElementById("search-equipment").value;
    const ingredients = document.getElementById("search-ingredient").value;
    
    const target = document.getElementById("results");
    target.replaceChildren();

    getRecipesList(query, cuisines, diets, types, equipment,ingredients); // Accepts arrays and comma delimited strings
    //getRecipesList(["pasta"],["Italian"],["vegetarian"],null,"tomato","main course");
}

async function getRecipesDetails(ids) {
    let params = "informationBulk?";

    const p1 = buildApiParams("ids", ids).then( x => params += x);

    await Promise.all([p1]);
    params = params.slice(0,-1);

    const response = await getAPI(API_BASE_URL + params);

    response.map( recipe => 
        displayResult(
            db.createDocumentWithId(recipe.title.toLowerCase(),"recipes", {
                name: recipe.title,
                id: recipe.id.toString(),
                sourceUrl: recipe.sourceUrl,
                summary: recipe.summary,
                image: recipe.image,
                preparationMinutes: recipe.preparationMinutes == -1 ? null : recipe.preparationMinutes,
                cookingMinutes: recipe.cookingMinutes == -1 ? null : recipe.cookingMinutes,
                cuisines: recipe.cuisines,
                diets: recipe.diets,
                dishTypes: recipe.dishTypes,
                equipment: (recipe.analyzedInstructions.length > 0 ? 
                    recipe.analyzedInstructions[0].steps.filter( 
                        step => step.equipment.length > 0
                    ).map( 
                        step => step.equipment.map( 
                            equipment => equipment.name 
                        )
                    ).flat().filter(
                        (value, index, self) => self.indexOf(value) === index
                    ) : []),
                ingredients: recipe.extendedIngredients.map( ingredient => ingredient.nameClean ),
                ingredients_label: recipe.extendedIngredients.map( ingredient => ingredient.original ),
                instructions: (recipe.analyzedInstructions.length > 0 ? 
                    recipe.analyzedInstructions[0].steps.map( 
                        step => step.number + ". " + step.step 
                    ) : []),
                upvote: 0,
                downvote: 0,
                views: 0
            })
        )
    );
}

async function displayResult(msg) {
    const target = document.getElementById("results");

    let p = document.createElement("p");
    p.style.color = "blue";
    p.innerHTML = await msg;
    target.append(p);
}

async function getRecipesList(query, cuisine, diet, type, equipment, ingredients) {
    let params = "complexSearch?";

    const p1 = buildApiParams("query", query).then( x => params += x);
    const p2 = buildApiParams("cuisine", cuisine).then( x => params += x);
    const p3 = buildApiParams("diet", diet).then( x => params += x);
    const p4 = buildApiParams("equipment",equipment).then( x => params += x);
    const p5 = buildApiParams("includeIngredients",ingredients).then( x => params += x);
    const p6 = buildApiParams("type",type).then( x => params += x);

    await Promise.all([p1,p2,p3,p4,p5,p6]);
    params += "number=" + numberOfResults;

    const response = await getAPI(API_BASE_URL + params);
    const ids = response.results.map( x => x.id);
    //return ids;
    getRecipesDetails(ids);

}

function getAPI(requestURL) {

    if (reqRem < -300 || resRem < -300) {
        const msg = "EXCEEDED RATE LIMIT BY 300. EXECUTION EXITED. STOP.";
        console.error(msg);
        throw new Error(msg) ;
    }

    const headers = new Headers();
    //headers.append('Host',)
    headers.append('X-RapidAPI-Key', API_KEY);
    headers.append('X-RapidAPI-Host', API_HOST);

    const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    const response = fetch(requestURL, requestOptions)
    .then((response) => {
        for (var pair of response.headers.entries()) {
            
            //Log current rate limit
            if (pair[0] === 'x-ratelimit-requests-limit') {
              reqLim = pair[1];
            } else if (pair[0] === 'x-ratelimit-requests-remaining') {
                reqRem = pair[1];
            } else if (pair[0] === 'x-ratelimit-requests-reset') {
                reqReset = pair[1];
            } else if (pair[0] === 'x-ratelimit-results-limit') {
                resLim = pair[1];
            } else if (pair[0] === 'x-ratelimit-results-remaining') {
                resRem = pair[1];
            } else if (pair[0] === 'x-ratelimit-results-reset') {
                resReset = pair[1];
            }
            
        }
        //Evaluate current rate limit
        const requests_message = reqRem + "/" + reqLim + " requests remaining. Reset occurs in " + new Date(reqReset * 1000).toISOString().substring(11, 19);
        console.log(requests_message);
        if (reqRem <= 10) {
            (reqRem > 0 ) ? 
                alert("STOP! You are about to exceed the daily rate limit. Overage charges will apply\n" + requests_message) 
                : alert("STOP! You have exceeded the daily rate limit. \nSheldon will be charged $" + Number.parseFloat(-0.007 * Number(reqRem)).toFixed(2) + " USD today.\n" + requests_message);
        }

        const results_message = resRem + "/" + resLim + " results remaining. Reset occurs in " + new Date(resReset * 1000).toISOString().substring(11, 19);
        console.log(results_message);
        if (resRem <= 10) {
            (resRem > 0 ) ? 
                alert("STOP! You are about to exceed the daily rate limit. Overage charges will apply\n" + results_message) 
                : alert("STOP! You have exceeded the daily rate limit. \nSheldon will be charged $" + Number.parseFloat(-0.007 * Number(resRem)).toFixed(2) + " USD today.\n" + results_message);
        }

        return response.json();
      })
    .catch(error => console.log('error', error));

    return response;
}

async function buildApiParams(key,value) {
    let params = "";
    if (value != null) {
        let terms = key + "=";
        if (Array.isArray(value)) {
            value.forEach(term => terms += encodeURIComponent(term) + ",")
            terms = terms.slice(0,-1);
            params += terms + "&";
        } else if (typeof value === 'string' || typeof value === 'number') {
            terms += encodeURI(value);
            params += terms + "&";
        }
    }
    return params.toLowerCase();
}