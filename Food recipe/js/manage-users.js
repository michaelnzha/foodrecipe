import * as db from './db.js';

loadManageUsers();

async function loadManageUsers() {

    const col = await db.getDocumentsCollection("users");
    let users = col.map( doc => { 
        const data = doc.data();
        data.id = doc.id;
        return data;
    })

    // ALL USERS
    displayUsers(users, "allUsers");

    loadUsersByBan(users);

    loadUsersByReviewRemoved(users);
    
}

async function loadUsersByBan(docs) {
        
    const banned = docs.filter( doc => doc.banned == true);
    
    displayUsers(banned, "bannedUsers");        
}

async function loadUsersByReviewRemoved(docs) {

    const col = await db.getDocumentsByQuery("reviews","removed",true);
    const reviews = col.map( doc => doc.data())
    let users = reviews.map( review => review.user)

    //filter users where id is in removed reviews user ids
    const usersWithReviewsRemoved = docs.filter(doc => users.includes(doc.id));

    displayUsers(usersWithReviewsRemoved, "adminRemoved");

}

window.banUser = async function banUser(user_id) {
    let user = await db.getDocument(user_id, "users");

    if (user != null) {
        const banned = true;
        user = {...user, banned};
        
         // Write updated review object back to db
         await db.editDocumentWithId(user_id,"users", user);
         location.reload();

    } else {
        alert("Unable to load user");
    }
}

window.unbanUser = async function unbanUser(user_id) {
    let user = await db.getDocument(user_id, "users");

    if (user != null) {
        const banned = false;
        user = {...user, banned};
        
         // Write updated review object back to db
         await db.editDocumentWithId(user_id,"users", user);
         location.reload();
        
    } else {
        alert("Unable to load user");
    }
}

async function displayUsers(users, element) {

    const target = document.getElementById(element);

    for (const key in users) {

        const user = users[key];

        const row = document.createElement("div");
        row.className = "row";
        target.append(row);

        const col1 = document.createElement("div");
        col1.className = "col-7 col-md-5 pe-0";
        row.append(col1);

        const name = document.createElement("h4");
        name.className = "mb-2 text-uppercase d-inline-block f400";
        name.innerHTML = user.username;
        col1.append(name);

        const col2 = document.createElement("div");
        col2.className = "col-5 col-md-7";
        row.append(col2);

        const ban = document.createElement("input");
        ban.setAttribute("type","button");
        
        if (user.banned == false) {
            ban.className = "btn btn-danger btn-small-xs top1 ms-2";             
            ban.setAttribute("value","Ban");
            ban.setAttribute("onclick","banUser(\"" +  user.id + "\")");
        } else if (user.banned == true) {
            ban.className = "btn btn-primary btn-small-xs top1 ms-2";             
            ban.setAttribute("value","Unban");
            ban.setAttribute("onclick","unbanUser(\"" +  user.id + "\")");
        }
        col2.append(ban);

    }

}