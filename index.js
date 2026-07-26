/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 1
Imports & DOM Setup
==================================================*/

import {
    auth,
    
    guestOnly,

    registerUser,

    googleLogin,

    createCustomer,

    createGoogleCustomer

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

const registerForm =
document.getElementById("registerForm");

const fullName =
document.getElementById("fullName");

const email =
document.getElementById("email");

const phone =
document.getElementById("phone");

const password =
document.getElementById("password");

const confirmPassword =
document.getElementById("confirmPassword");

const agreeTerms =
document.getElementById("agreeTerms");

const registerButton =
document.getElementById("registerButton");

const googleRegister =
document.getElementById("googleRegister");

const togglePassword =
document.getElementById("togglePassword");

const toggleConfirmPassword =
document.getElementById("toggleConfirmPassword");

const loadingScreen =
document.getElementById("loadingScreen");

const buttonText =
document.getElementById("buttonText");

const buttonLoader =
document.getElementById("buttonLoader");

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

const toastIcon =
document.getElementById("toastIcon");

const successModal =
document.getElementById("successModal");

const continueButton =
document.getElementById("continueButton");

console.log("Register.js Loaded Successfully");

/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 2
UI Functions
==================================================*/

/*==================================
SHOW LOADING
==================================*/

function showLoading(){

    loadingScreen.style.display = "flex";

    buttonText.style.display = "none";

    buttonLoader.style.display = "inline-block";

    registerButton.disabled = true;

    googleRegister.disabled = true;

}

/*==================================
HIDE LOADING
==================================*/

function hideLoading(){

    loadingScreen.style.display = "none";

    buttonText.style.display = "inline";

    buttonLoader.style.display = "none";

    registerButton.disabled = false;

    googleRegister.disabled = false;

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
SUCCESS MODAL
==================================*/

function showSuccessModal(){

    successModal.style.display = "flex";

}

if(continueButton){

    continueButton.addEventListener("click",()=>{

        window.location.href = "index.html";

    });

}

/*==================================
PASSWORD TOGGLE
==================================*/

function toggleVisibility(input,button){

    const icon = button.querySelector("i");

    if(input.type==="password"){

        input.type="text";

        icon.classList.replace(

            "fa-eye",

            "fa-eye-slash"

        );

    }

    else{

        input.type="password";

        icon.classList.replace(

            "fa-eye-slash",

            "fa-eye"

        );

    }

}

togglePassword.addEventListener("click",()=>{

    toggleVisibility(

        password,

        togglePassword

    );

});

toggleConfirmPassword.addEventListener("click",()=>{

    toggleVisibility(

        confirmPassword,

        toggleConfirmPassword

    );

});

/*==================================
INPUT ANIMATION
==================================*/

document
.querySelectorAll(".input-wrapper input")
.forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.style.transform =
        "translateY(-2px)";

    });

    input.addEventListener("blur",()=>{

        input.parentElement.style.transform =
        "translateY(0)";

    });

});


/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 3
Validation
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
PHONE VALIDATION
==================================*/

function validatePhone(phone){

    return /^[0-9]{11}$/.test(phone.trim());

}

/*==================================
SHOW INPUT ERROR
==================================*/

function markInvalid(input){

    input.style.borderColor = "#ef4444";

    input.focus();

}

/*==================================
CLEAR ERRORS
==================================*/

function clearErrors(){

    document.querySelectorAll("input").forEach(input=>{

        input.style.borderColor = "#e2e8f0";

    });

}

/*==================================
VALIDATE FORM
==================================*/

function validateForm(){

    clearErrors();

    if(fullName.value.trim().length < 3){

        showToast(

            "Full name must contain at least 3 characters.",

            "error"

        );

        markInvalid(fullName);

        return false;

    }

    if(!validateEmail(email.value)){

        showToast(

            "Please enter a valid email address.",

            "error"

        );

        markInvalid(email);

        return false;

    }

    if(!validatePhone(phone.value)){

        showToast(

            "Phone number must contain exactly 11 digits.",

            "error"

        );

        markInvalid(phone);

        return false;

    }

    if(password.value.length < 6){

        showToast(

            "Password must be at least 6 characters.",

            "error"

        );

        markInvalid(password);

        return false;

    }

    if(password.value !== confirmPassword.value){

        showToast(

            "Passwords do not match.",

            "error"

        );

        markInvalid(confirmPassword);

        return false;

    }

    if(!agreeTerms.checked){

        showToast(

            "Please agree to the Terms & Conditions.",

            "error"

        );

        return false;

    }

    return true;

}

/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 4
Email Registration
==================================================*/

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if(!validateForm()) return;

    showLoading();

    try{

        const userCredential = await registerUser(

            fullName.value.trim(),

            email.value.trim().toLowerCase(),

            password.value.trim()

        );

        const user = userCredential.user;

        await createCustomer(

            user,

            phone.value.trim()

        );

        await createNotification({

            uid: user.uid,

            title: "Welcome to UY Power Solutions",

            message: "Your account has been created successfully. We're glad to have you with us.",

            type: "success",

            icon: "fa-circle-check",

            sender: "system",

            link: "index.html"

        });

        hideLoading();

        showToast(

            "Account created successfully."

        );

        registerForm.reset();

        showSuccessModal();

    }

    catch(error){

        hideLoading();

        console.error(error);

        switch(error.code){

            case "auth/email-already-in-use":

                showToast(

                    "This email is already registered.",

                    "error"

                );

                markInvalid(email);

                break;

            case "auth/invalid-email":

                showToast(

                    "Invalid email address.",

                    "error"

                );

                markInvalid(email);

                break;

            case "auth/weak-password":

                showToast(

                    "Password is too weak.",

                    "error"

                );

                markInvalid(password);

                break;

            case "auth/network-request-failed":

                showToast(

                    "Please check your internet connection.",

                    "error"

                );

                break;

            default:

                showToast(

                    error.message,

                    "error"

                );

        }

    }

});

/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 5
Google Registration
==================================================*/

googleRegister.addEventListener("click", async () => {

    showLoading();

    try{

        const result = await googleLogin();

        const user = result.user;

        await createGoogleCustomer(user);

        await createNotification({

            uid: user.uid,

            title: "Google Registration",

            message: "Your Google account has been registered successfully.",

            type: "success",

            icon: "fa-google",

            sender: "system",

            link: "index.html"

        });

        hideLoading();

        showToast(
            "Google registration successful."
        );

        setTimeout(() => {

            window.location.href =
            "index.html";

        }, 1200);

    }

    catch(error){

        hideLoading();

        console.error(error);

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

                showToast(
                    error.message,
                    "error"
                );

        }

    }

});

/*==================================================
UY POWER SOLUTIONS
REGISTER SYSTEM
Part 6
Startup & Final Setup
==================================================*/

/*==================================
AUTH STATE
==================================*/

import {

    auth

} from "./auth-utils.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

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
PRESS ENTER
==================================*/

document.addEventListener("keydown",(e)=>{

    if(

        e.key==="Enter" &&

        document.activeElement.tagName==="INPUT"

    ){

        registerForm.requestSubmit();

    }

});

/*==================================
STARTUP MESSAGE
==================================*/

window.addEventListener("load",()=>{

    console.log("====================================");

    console.log("UY POWER SOLUTIONS");

    console.log("Register System Ready");

    console.log("Firebase Connected");

    console.log("Google Authentication Ready");

    console.log("====================================");

});