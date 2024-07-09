import * as db from './db.js';

displayRecipes();

async function displayRecipes() {
    const target = document.getElementById("allRecipes")

    const col = await db.getDocumentsCollection("recipes");
    const docs = col.map(doc => doc.data());

    const featuredCol = await db.getDocumentsCollection("featuredRecipes");
    const featuredDocs = featuredCol.map(doc => doc.id);

    for (const key in docs) {

        const recipe = docs[key];

        const row = document.createElement("div");
        row.className = "row";
        target.append(row);

        const col1 = document.createElement("div");
        col1.className = "col-12 col-md-8 pe-0";
        row.append(col1);

        const name = document.createElement("h6");
        name.className = "mb-2 text-uppercase d-inline-block f400";
        name.innerHTML = recipe.name;
        col1.append(name);

        const col2 = document.createElement("div");
        col2.className = "col-5 col-md-4";
        row.append(col2);

        const edit = document.createElement("a");
        edit.setAttribute("href","/create-recipe.html?id=" + recipe.name)
        edit.className = "btn btn-primary btn-small-xs top1 ms-2";
        edit.innerHTML = "Edit";
        col2.append(edit);

        const feature = document.createElement("input");
        feature.setAttribute("type","button");
        if (featuredDocs.includes(recipe.name.toLowerCase())) {
            feature.className = "btn btn-outline-success btn-small-xs top1 ms-2";             
            feature.setAttribute("value","Unfeature");
            feature.setAttribute("onclick","unfeature(\"" +  recipe.name + "\")");
        } else {
            feature.className = "btn btn-success btn-small-xs top1 ms-2";             
            feature.setAttribute("value","Feature");
            feature.setAttribute("onclick","feature(\"" +  recipe.name + "\")");
        }
        col2.append(feature);

        let br = document.createElement("br");
        target.append(br);


    }
}

window.feature = async function feature(recipe_id) {
    let recipe = await db.getDocument(recipe_id, "featuredRecipes");

    if (recipe == null) {
        const uid = sessionStorage.getItem("userID");
        let user = await db.getDocument(uid, "users");
        await db.createDocumentWithId(recipe_id.toLowerCase(),"featuredRecipes", {
            admin: user.username,
            ref: "/recipes/" + recipe_id
        })

    }
    location.reload();
}

window.unfeature = async function unfeature(recipe_id) {
    let recipe = await db.getDocument(recipe_id.toLowerCase(), "featuredRecipes");

    if (recipe != null) {
        await db.deleteDocumentById(recipe_id.toLowerCase(), "featuredRecipes");
    }
    location.reload();
}