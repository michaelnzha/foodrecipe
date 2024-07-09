const nav = document.getElementById("nav");

// <div class="container-fluid">
let container = document.createElement("div");
container.className = "container-fluid";
nav.appendChild(container);

//<a class="navbar-brand" href="#">Meal Planner</a>
let brand = document.createElement("a");
brand.className = "navbar-brand";
brand.setAttribute('href', "/home.html");
brand.innerText = "Meal Planner";
container.appendChild(brand);

//<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
//        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
//        <span class="navbar-toggler-icon"></span>
//</button>
let navbar_toggler = document.createElement("button");
navbar_toggler.className = "navbar-toggler";
navbar_toggler.setAttribute('type', "button");
navbar_toggler.setAttribute('data-bs-toggle', "collapse");
navbar_toggler.setAttribute('data-bs-target', "#navbarNavDropdown");
navbar_toggler.setAttribute('aria-controls', "navbarNavDropdown");
navbar_toggler.setAttribute('aria-expanded', "false");
navbar_toggler.setAttribute('aria-label', "Toggle navigation");
container.appendChild(navbar_toggler);

let navbar_toggler_icon = document.createElement("span");
navbar_toggler_icon.className = "navbar-toggler-icon";
navbar_toggler.appendChild(navbar_toggler_icon);

// <div class="collapse navbar-collapse" id="navbarNavDropdown">
let navbarNavDropdown = document.createElement("div");
navbarNavDropdown.className = "collapse navbar-collapse";
navbarNavDropdown.id = "navbarNavDropdown";
container.appendChild(navbarNavDropdown);

// <ul class="navbar-nav">
let ul = document.createElement("ul");
ul.className = "navbar-nav";
navbarNavDropdown.appendChild(ul);

// --- HOME ---

// <li class="nav-item">
let li1 = document.createElement("li");
li1.className = "nav-item";
ul.appendChild(li1);

//<a class="navbar-brand" href="#">Meal Planner</a>
let home = document.createElement("a");
home.className = "nav-link active";
home.setAttribute('href', "home.html");
home.setAttribute('aria-current', "page");
home.innerText = "Home";
li1.appendChild(home);


// --- SEARCH ---

// <li class="nav-item">
let li2 = document.createElement("li");
li2.className = "nav-item";
ul.appendChild(li2);

//<a class="nav-link" href="search.html">Search</a>
let search = document.createElement("a");
search.className = "nav-link active";
search.setAttribute('href', "search.html");
search.innerText = "Search";
li2.appendChild(search);

// --- ACCOUNT ---

// <li class="nav-item dropdown">
let li3 = document.createElement("li");
li3.className = "nav-item dropdown";
ul.appendChild(li3);

//<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Account </a>
let account = document.createElement("a");
account.className = "nav-link dropdown-toggle active";
account.setAttribute('href', "#");
account.setAttribute('role', "button");
account.setAttribute('data-bs-toggle', "dropdown");
account.setAttribute('aria-expanded', "false");
account.innerText = "Account";
li3.appendChild(account);

// <ul class="dropdown-menu">
let account_ul = document.createElement("ul");
account_ul.className = "dropdown-menu";
li3.appendChild(account_ul);

// <li>
let li3a = document.createElement("li");
account_ul.appendChild(li3a);

// <a class="dropdown-item" href="profile.html">Profile</a>
let profile = document.createElement("a");
profile.className = "dropdown-item";
profile.setAttribute('href', "profile.html");
profile.innerText = "Profile";
li3a.appendChild(profile);

// <li>
let li3b = document.createElement("li");
account_ul.appendChild(li3b);

// <a class="dropdown-item" href="account-settings.html">Settings</a>
let settings = document.createElement("a");
settings.className = "dropdown-item";
settings.setAttribute('href', "account-settings.html");
settings.innerText = "Settings";
li3b.appendChild(settings);

// --- ADMIN ---

// <li class="nav-item dropdown">
let li4 = document.createElement("li");
li4.className = "nav-item dropdown";
li4.id = "admin-options";
ul.appendChild(li4);

//<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Admin View </a>
let admin_view = document.createElement("a");
admin_view.className = "nav-link dropdown-toggle active";
admin_view.setAttribute('href', "#");
admin_view.setAttribute('role', "button");
admin_view.setAttribute('data-bs-toggle', "dropdown");
admin_view.setAttribute('aria-expanded', "false");
admin_view.innerText = "Admin View";
li4.appendChild(admin_view);

// <ul class="dropdown-menu">
let admin_ul = document.createElement("ul");
admin_ul.className = "dropdown-menu";
li4.appendChild(admin_ul);

// <li>
let li4a = document.createElement("li");
admin_ul.appendChild(li4a);

// <a class="dropdown-item" href="manage-users.html">Manage Users</a>
let mUsers = document.createElement("a");
mUsers.className = "dropdown-item";
mUsers.setAttribute('href', "manage-users.html");
mUsers.innerText = "Manage Users";
li4a.appendChild(mUsers);

// <li>
let li4b = document.createElement("li");
admin_ul.appendChild(li4b);

// <a class="dropdown-item" href="manage-recipes.html">Manage Recipes</a>
let mRecipes = document.createElement("a");
mRecipes.className = "dropdown-item";
mRecipes.setAttribute('href', "manage-recipes.html");
mRecipes.innerText = "Manage Recipes";
li4b.appendChild(mRecipes);

// <li>
let li4c = document.createElement("li");
admin_ul.appendChild(li4c);

// <a class="dropdown-item" href="manage-reviews.html">Manage Reviews</a>
let mReviews = document.createElement("a");
mReviews.className = "dropdown-item";
mReviews.setAttribute('href', "manage-reviews.html");
mReviews.innerText = "Manage Reviews";
li4c.appendChild(mReviews);

// <li>
let li4d = document.createElement("li");
admin_ul.appendChild(li4d);

// <a class="dropdown-item" href="manage-reviews.html">Manage Reviews</a>
let mAPI = document.createElement("a");
mAPI.className = "dropdown-item";
mAPI.setAttribute('href', "recipe-api-load.html");
mAPI.innerText = "Recipe API Loader";
li4d.appendChild(mAPI);

// <li>
let li4e = document.createElement("li");
admin_ul.appendChild(li4e);

// <<a class="dropdown-item" href="statistics.html">Statistics</a>
let stats = document.createElement("a");
stats.className = "dropdown-item";
stats.setAttribute('href', "statistics.html");
stats.innerText = "Statistics";
li4e.appendChild(stats);

// --- SIGN OUT ---

// <li class="nav-item dropdown">
let li5 = document.createElement("li");
li5.className = "nav-item";
ul.appendChild(li5);

// <a class="nav-link" id="signoutBtn" href="#">Sign Out</a>
let signout = document.createElement("a");
signout.className = "nav-link active";
signout.id = "signoutBtn";
signout.setAttribute('href', "index.html");
signout.innerText = "Sign Out";
li5.appendChild(signout);

/*
<nav id="nav" class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Meal Planner</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="home.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="search.html">Search</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Account
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                            <li><a class="dropdown-item" href="account-settings.html">Settings</a></li>
                        </ul>
                    </li>
                    <li id="admin-options" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Admin View
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="manage-users.html">Manage Users</a></li>
                            <li><a class="dropdown-item" href="manage-recipes.html">Manage Recipes</a></li>
                            <li><a class="dropdown-item" href="manage-reviews.html">Manage Reviews</a></li>
                            <li><a class="dropdown-item" href="statistics.html">Statistics</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="signoutBtn" href="#">Sign Out</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    */