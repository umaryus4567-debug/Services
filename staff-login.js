import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtK8uoKkaZVVnzRFOplPxLNxKnpVCf24Q",
    authDomain: "rose-a7757.firebaseapp.com",
    projectId: "rose-a7757",
    storageBucket: "rose-a7757.firebasestorage.app",
    messagingSenderId: "648446292944",
    appId: "1:648446292944:web:8e50120d78800d4d487fd5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const form =
document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        alert("Checking login...");

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login successful ✅");

        window.location.href =
        "dashboard.html";

    } catch(error) {

        console.error(error);

        alert(
            "Login failed ❌\n\n" +
            error.message
        );

    }

});