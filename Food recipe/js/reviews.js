import * as db from './db.js';

reviewsController();

async function reviewsController() {
    const uid = sessionStorage.getItem("userID");
    let user = await db.getDocument(uid, "users");
    let admin = false;

    if (user != null) {
        if (user.admin == true) {
            admin = true;
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = decodeURI(urlParams.get('id'))

    if (id != 'null') {
        await loadReviewsByRecipe(id, admin);
    } else {
        await loadAllReviews(admin);
        await loadRemovedReviews(admin);
    }
    
}

// For display recipe page
async function loadReviewsByRecipe(recipe_id, admin) {
    const col = await db.getDocumentsByQuery("reviews","recipe", recipe_id);
    let docs = col.map( doc => { 
        const data = doc.data();
        data.id = doc.id;
        return data;
    })

    docs.sort((x,y) => y.timestamp - x.timestamp);

    displayReviews(docs, "reviews-container", admin, false);
}

// For manage reviews page
async function loadAllReviews(admin) {
    const col = await db.getDocumentsCollection("reviews");
    let docs = col.map( doc => { 
        const data = doc.data();
        data.id = doc.id;
        return data;
    })

    docs.sort((x,y) => y.timestamp - x.timestamp);

    displayReviews(docs, "reviews-container", admin, true);
}

async function loadRemovedReviews(admin) {
    const col = await db.getDocumentsByQuery("reviews","removed",true);
    let docs = col.map( doc => { 
        const data = doc.data();
        data.id = doc.id;
        return data;
    })

    docs.sort((x,y) => y.timestamp - x.timestamp);

    displayReviews(docs, "removed-reviews-container", admin, true);
}

window.submitReview = async function submitReview() {
    const timestamp = new Date();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const recipe = decodeURI(urlParams.get('id'))

    let sentiment = false;
    if (document.getElementById("up").checked == true) {
        sentiment = true;
    } else if (document.getElementById("down").checked == true) {
        sentiment = false;
    } else {
        alert("Did you like or dislike the recipe? Please select an option and submit again.");
        return;
    }

    const uid = sessionStorage.getItem("userID");
    const user = await db.getDocument(uid, "users");
    if (user != null) {
        const title = document.getElementById("submit-review-title").value
        const comment = document.getElementById("submit-review-text").value

        if (title.length > 0 && comment.length > 0) {
            await db.createDocument("reviews", {
                recipe: recipe,
                user: uid,
                timestamp: timestamp,
                sentiment: sentiment,
                title: title,
                comment: comment,
                removed: false
             });
            location.reload();
        } else {
            alert("Please write a title and comment for your review and submit again.");
            return;
        }

    } else {
        alert("ERROR: Unable to load user details.");
        window.location.href = '/index.html';
    }
}

window.removeReview = async function removeReview(review_id) {
    let review = await db.getDocument(review_id, "reviews");

    if (review != null) {
        const removed = true;
        review = {...review, removed};
        
         // Write updated review object back to db
         await db.editDocumentWithId(review_id,"reviews",review);
         location.reload();
        
    } else {
        alert("Unable to load review");
    }
}

window.restoreReview = async function restoreReview(review_id) {
    let review = await db.getDocument(review_id, "reviews");

    if (review != null) {
        const removed = false;
        review = {...review, removed};
        
         // Write updated review object back to db
         await db.editDocumentWithId(review_id,"reviews",review);
         location.reload();
        
    } else {
        alert("Unable to load review");
    }
}

async function displayReviews(docs, element, admin, all) {
    const target = document.getElementById(element);

    for (const key in docs) {

        if (docs[key].removed == false || all) {
            const review = docs[key];
            const userDoc = await db.getDocument(review.user, "users");
            const name = userDoc.username;

            let card = document.createElement("div");
            card.className = "card";
            target.append(card);

            let card_body = document.createElement("div");
            card_body.className = "card-body";
            card.append(card_body);

            let row = document.createElement("div");
            row.className = "row";
            card_body.append(row);

            let title = document.createElement("h5");
            title.className = "card-title col-11";
            title.innerHTML = review.title;
            row.append(title);

            let sentiment = document.createElement("div");
            sentiment.className = "col-1";
            row.append(sentiment);

            let updown_container = document.createElement("h3");
            sentiment.append(updown_container);

            let updown = document.createElement("i");
            if (review.sentiment) {
                updown.className = "bi bi-heart-fill";
            } else {
                updown.className = "bi bi-heartbreak-fill";
            }
            updown_container.append(updown);

            let username = document.createElement("h6");
            username.className = "card-subtitle mb-2";
            username.innerHTML = (all) ? name + " - " + docs[key].recipe: name;
            card_body.append(username);

            let timestamp = document.createElement("h6");
            timestamp.className = "card-subtitle mb-2 text-muted";
            let date = new Date(0);
            date.setUTCSeconds(review.timestamp.seconds);
            timestamp.innerHTML = date.toLocaleString();
            card_body.append(timestamp);

            let comment = document.createElement("p");
            comment.className = "card-text";
            comment.innerHTML = review.comment;
            card_body.append(comment);

            if (admin) {
                let admin_section = document.createElement("div");
                admin_section.className = "card-footer text-muted";
                card.append(admin_section);

                const isRemoved = docs[key].removed;
                if (isRemoved == false) {
                    let remove = document.createElement("input");
                    remove.className = "btn btn-primary";
                    remove.setAttribute("type","button");
                    remove.setAttribute("value","Remove Review");
                    remove.setAttribute("onclick","removeReview(\"" +  review.id + "\")");
                    admin_section.append(remove);
                } else if (isRemoved == true){
                    let restore = document.createElement("input");
                    restore.className = "btn btn-secondary";
                    restore.setAttribute("type","button");
                    restore.setAttribute("value","Restore Review");
                    restore.setAttribute("onclick","restoreReview(\"" +  review.id + "\")");
                    admin_section.append(restore);
                }
                

                //<input class="btn btn-primary" type="button" value="Submit Query" onclick="getRecipes('results')">
            }

            let br = document.createElement("br");
            target.append(br);

        }
    
    }
}
