import * as db from './db.js';

window.saveAccountSettings = async function saveAccountSettings() {
    const uid = sessionStorage.getItem("userID");
    let user = await db.getDocument(uid, "users");

    if (user != null) {
        // Validate password
        const password = document.getElementById("currentPwd").value;
        if (user.pwd == password) {

            const pwd = document.getElementById("newPwd").value;
            const email = document.getElementById("newEmail").value;

            // if a new password has been provided
            if (pwd.trim().length > 0) {
                // Double check new password
                const reenterNewPwd = document.getElementById("reenterNewPwd").value;
                if (pwd == reenterNewPwd) {
                    //update user object with new password
                    user = {...user, pwd};
                } else {
                    alert("New passwords do not match. Please review your entry and try again.");
                    return;
                }

            }

            // if a new email has been provided
            if (email.trim().length > 0) {
                // Double check new email
                const reenterNewEmail = document.getElementById("reenterNewEmail").value;
                if (email == reenterNewEmail) {
                    //update user object with new email
                    user = {...user, email};
                } else {
                    alert("New emails do not match. Please review your entry and try again.");
                    return;
                }
            }

            // Write updated user object back to db
            db.editDocumentWithId(uid,"users",user);
            alert("User settings updated!");
            window.location.href = '/home.html';
            
        } else {
            alert("Incorrect password. Please review your entry and try again.");
        }
    } else {
        alert("Unable to load user to page");
        window.location.href = '/index.html';
    }
}