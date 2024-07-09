    /* REFERENCE: DO A BATCH WRITE TO FIRESTORE:
    // Get a new write batch
    const batch = writeBatch(db);

    // Set the values of accounts collection
    const accountsRef = doc(collection(db, "accounts"));
    batch.set(accountsRef, {
        fname: fname,
        lname: lname,
        uname: uname,
        email: email,
        pwd: pwd1,
        admin: false,
        banned: false,
    });

    // Set the values of usernames collection
    const usernamesRef = doc(db, "usernames", uname);
    batch.set(usernamesRef, {id: accountsRef.id});

    await batch.commit();
    */

    /* REFERENCE: DO A WRITE TO FIRESTORE COLLECTION AND SET THE UNIQUE ID TO UNAME
    const docRef = doc(db, "accounts", uname);
    await setDoc(docRef, {
        email: email,
        pwd: pwd
    });
    */
