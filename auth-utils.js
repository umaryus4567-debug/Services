import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export async function registerUser(fullName, email, password, phone) {

    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    const user = userCredential.user;

    await updateProfile(user, {
        displayName: fullName
    });

    await setDoc(doc(db, "users", user.uid), {

        uid: user.uid,

        fullName,

        email,

        phone,

        role: "customer",

        provider: "email",

        photoURL: user.photoURL || "",

        createdAt: serverTimestamp(),

        lastLogin: serverTimestamp()

    });

    return user;

}

export async function loginUser(email, password) {

    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    const user = userCredential.user;

    await updateDoc(
        doc(db, "users", user.uid),
        {
            lastLogin: serverTimestamp()
        }
    );

    return user;

}

export async function googleLogin() {

    const result = await signInWithPopup(
        auth,
        googleProvider
    );

    const user = result.user;

    const userRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {

        await setDoc(userRef, {

            uid: user.uid,

            fullName: user.displayName || "Customer",

            email: user.email,

            phone: "",

            role: "customer",

            provider: "google",

            photoURL: user.photoURL || "",

            createdAt: serverTimestamp(),

            lastLogin: serverTimestamp()

        });

    } else {

        await updateDoc(userRef, {

            lastLogin: serverTimestamp()

        });

    }

    return user;

}

/*==================================
RESET PASSWORD
==================================*/

export async function resetPassword(email) {

    return await sendPasswordResetEmail(auth, email);

}

/*==================================
LOGOUT
==================================*/

export async function logoutUser() {

    return await signOut(auth);

}

/*==================================
CURRENT USER
==================================*/

export function getCurrentUser() {

    return auth.currentUser;

}

/*==================================
AUTH LISTENER
==================================*/

export function authListener(callback) {

    onAuthStateChanged(auth, callback);

}

/*==================================
PROTECT PAGE
==================================*/

export function protectPage() {

    onAuthStateChanged(auth, (user) => {

        console.log("Protect Check:", user);

        if (!user) {

            window.location.replace("login.html");

        }

    });

}

/*==================================
GUEST ONLY
==================================*/

export function guestOnly() {

    onAuthStateChanged(auth, (user) => {

        console.log("Guest Check:", user);

        if (user) {

            window.location.replace("home.html");

        }

    });

}

/*==================================
LOAD USER
==================================*/

export function loadUser() {

    onAuthStateChanged(auth, (user) => {

        if (!user) return;

        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        const userImage = document.getElementById("userImage");

        if (userName) {

            userName.textContent =
                user.displayName || "Customer";

        }

        if (userEmail) {

            userEmail.textContent =
                user.email;

        }

        if (userImage) {

            userImage.src =
                user.photoURL || "default-user.png";

        }

    });

}

/*==================================
EXPORT AUTH
==================================*/

export { auth };