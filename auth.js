/*==================================================
UY POWER SOLUTIONS
LOGIN SYSTEM
Part 1
Imports & DOM Setup
==================================================*/

import {
    auth,
    loginUser,
    googleLogin,
    guestOnly
} from "./auth-utils.js";

import {
    createNotification
} from "./notification-utils.js";

/*==================================
GUEST ONLY
==================================*/

guestOnly();

/*==================================
DOM ELEMENTS
==================================*/

const loginForm =
document.getElementById("loginForm");

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const rememberMe =
document.getElementById("remember");

const authButton =
document.getElementById("authButton");

const googleButton =
document.getElementById("googleLogin");

const togglePassword =
document.getElementById("togglePassword");

const buttonText =
document.getElementById("buttonText");

const buttonLoader =
document.getElementById("buttonLoader");

const loadingScreen =
document.getElementById("loadingScreen");

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

const toastIcon =
document.getElementById("toastIcon");

console.log("Login.js Loaded Successfully");

/*==================================================
UY POWER SOLUTIONS
LOGIN SYSTEM
Part 2
UI Functions
==================================================*/

/*==================================
EMAIL VALIDATION
==================================*/

function validateEmail(email){

    const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email.trim());

}

/*==================================
SHOW LOADING
==================================*/

function showLoading(){

    loadingScreen.style.display = "flex";

    buttonText.style.display = "none";

    buttonLoader.style.display = "inline-block";

    authButton.disabled = true;

    googleButton.disabled = true;

}

/*==================================
HIDE LOADING
==================================*/

function hideLoading(){

    loadingScreen.style.display = "none";

    buttonText.style.display = "inline";

    buttonLoader.style.display = "none";

    authButton.disabled = false;

    googleButton.disabled = false;

}

/*==================================
SHOW TOAST
==================================*/

function showToast(message,type="success"){

    toastMessage.textContent = message;

    toast.classList.add("show");

    if(type==="success"){

        toast.style.borderLeft =
        "6px solid #22c55e";

        toastIcon.className =
        "fa-solid fa-circle-check";

    }

    else{

        toast.style.borderLeft =
        "6px solid #ef4444";

        toastIcon.className =
        "fa-solid fa-circle-xmark";

    }

    setTimeout(()=>{

        toast.classList.remove("show");

    },3500);

}

/*==================================
PASSWORD TOGGLE
==================================*/

togglePassword.addEventListener("click",()=>{

    const icon =
    togglePassword.querySelector("i");

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        icon.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    }

    else{

        passwordInput.type="password";

        icon.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );

    }

});

/*==================================
REMEMBER EMAIL
==================================*/

window.addEventListener("load",()=>{

    const savedEmail =
    localStorage.getItem("rememberEmail");

    if(savedEmail){

        emailInput.value = savedEmail;

        rememberMe.checked = true;

    }

});

function saveRememberEmail(){

    if(rememberMe.checked){

        localStorage.setItem(

            "rememberEmail",

            emailInput.value

        );

    }

    else{

        localStorage.removeItem(

            "rememberEmail"

        );

    }

}

rememberMe.addEventListener(

    "change",

    saveRememberEmail

);

emailInput.addEventListener(

    "keyup",

    saveRememberEmail

);

/*==================================================
UY POWER SOLUTIONS
LOGIN SYSTEM
Part 3
Email Login
==================================================*/

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    emailInput.value.trim().toLowerCase();

    const password =
    passwordInput.value.trim();

    if(email === ""){

        showToast(
            "Please enter your email.",
            "error"
        );

        emailInput.focus();

        return;

    }

    if(!validateEmail(email)){

        showToast(
            "Please enter a valid email address.",
            "error"
        );

        emailInput.focus();

        return;

    }

    if(password === ""){

        showToast(
            "Please enter your password.",
            "error"
        );

        passwordInput.focus();

        return;

    }

    if(password.length < 6){

        showToast(
            "Password must be at least 6 characters.",
            "error"
        );

        passwordInput.focus();

        return;

    }

    showLoading();

    try{

        const userCredential =
        await loginUser(email,password);

        const user =
        userCredential.user;

        await createNotification({

            uid: user.uid,

            title: "Login Successful",

            message: "Welcome back to UY Power Solutions.",

            type: "info",

            icon: "fa-right-to-bracket",

            sender: "system",

            link: "index.html"

        });

        hideLoading();

        showToast(
            "Login Successful!"
        );

        setTimeout(()=>{

            window.location.href =
            "index.html";

        },1200);

    }

    catch(error){

        hideLoading();

        switch(error.code){

            case "auth/user-not-found":

                showToast(
                    "Account not found.",
                    "error"
                );

                break;

            case "auth/wrong-password":

            case "auth/invalid-credential":

                showToast(
                    "Invalid email or password.",
                    "error"
                );

                break;

            case "auth/invalid-email":

                showToast(
                    "Invalid email address.",
                    "error"
                );

                break;

            case "auth/too-many-requests":

                showToast(
                    "Too many login attempts. Please try again later.",
                    "error"
                );

                break;

            case "auth/network-request-failed":

                showToast(
                    "Please check your internet connection.",
                    "error"
                );

                break;

            default:

                console.error(error);

                showToast(
                    error.message,
                    "error"
                );

        }

    }

});

/*==================================================
UY POWER SOLUTIONS
LOGIN SYSTEM
Part 4
Google Login
==================================================*/

googleButton.addEventListener("click", async () => {

    showLoading();

    try{

        const result = await googleLogin();

        const user = result.user;

        await createNotification({

            uid: user.uid,

            title: "Google Login",

            message: "You logged in successfully with Google.",

            type: "info",

            icon: "fa-google",

            sender: "system",

            link: "index.html"

        });

        hideLoading();

        showToast(
            "Google Login Successful!"
        );

        setTimeout(() => {

            window.location.href =
            "index.html";

        }, 1200);

    }

    catch(error){

        hideLoading();

        switch(error.code){

            case "auth/popup-closed-by-user":

                showToast(
                    "Google sign in was cancelled.",
                    "error"
                );

                break;

            case "auth/popup-blocked":

                showToast(
                    "Popup was blocked by your browser.",
                    "error"
                );

                break;

            case "auth/network-request-failed":

                showToast(
                    "Please check your internet connection.",
                    "error"
                );

                break;

            default:

                console.error(error);

                showToast(
                    error.message,
                    "error"
                );

        }

    }

});
/*==================================================
UY POWER SOLUTIONS
LOGIN SYSTEM
Part 5
Startup & Final Setup
==================================================*/

/*==================================
CHECK AUTH STATE
==================================*/

import {
    auth
} from "./auth-utils.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if(user){

        console.log(
            "Logged in as:",
            user.email
        );

    }

    else{

        console.log(
            "No active user."
        );

    }

});

/*==================================
STARTUP MESSAGE
==================================*/

window.addEventListener("load",()=>{

    console.log("====================================");

    console.log("UY POWER SOLUTIONS");

    console.log("Login System Ready");

    console.log("Firebase Connected");

    console.log("Authentication Ready");

    console.log("====================================");

});