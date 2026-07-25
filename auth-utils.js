/*==================================================
UY POWER SOLUTIONS
AUTH UTILITIES
==================================================*/

import { app } from "./firebase-config.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export { auth, db };
/*==================================================
AUTHENTICATION FUNCTIONS
==================================================*/

/*
==================================
LOGIN USER
==================================
*/

export async function loginUser(email, password) {

    await setPersistence(
        auth,
        browserLocalPersistence
    );

    return await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

}

/*
==================================
REGISTER USER
==================================
*/

export async function registerUser(
    fullName,
    email,
    password
) {

    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    await updateProfile(
        userCredential.user,
        {
            displayName: fullName
        }
    );

    return userCredential;

}

/*
==================================
GOOGLE LOGIN
==================================
*/

export async function googleLogin() {

    return await signInWithPopup(
        auth,
        googleProvider
    );

}

/*
==================================
RESET PASSWORD
==================================
*/

export async function resetPassword(email) {

    return await sendPasswordResetEmail(
        auth,
        email
    );

}

/*
==================================
LOGOUT USER
==================================
*/

export async function logoutUser() {

    return await signOut(auth);

}

/*
==================================
CURRENT USER
==================================
*/

export function getCurrentUser() {

    return auth.currentUser;

}
/*==================================================
FIRESTORE USER MANAGER
==================================================*/

/*
==================================
SAVE USER PROFILE
==================================
*/

export async function saveUserProfile(user, data = {}) {

    await setDoc(

        doc(db, "users", user.uid),

        {
            uid: user.uid,

            fullName:
                data.fullName ||
                user.displayName ||
                "Customer",

            email: user.email,

            phone:
                data.phone || "",

            role:
                data.role || "customer",

            provider:
                data.provider || "email",

            photoURL:
                user.photoURL || "",

            status: "active",

            emailVerified:
                user.emailVerified,

            createdAt:
                serverTimestamp(),

            lastLogin:
                serverTimestamp()

        },

        {
            merge: true
        }

    );

}

/*
==================================
GET USER PROFILE
==================================
*/

export async function getUserProfile(uid) {

    const snapshot = await getDoc(

        doc(db, "users", uid)

    );

    if (snapshot.exists()) {

        return snapshot.data();

    }

    return null;

}

/*
==================================
UPDATE USER PROFILE
==================================
*/

export async function updateUserProfile(uid, data) {

    await updateDoc(

        doc(db, "users", uid),

        data

    );

}

/*
==================================
UPDATE LAST LOGIN
==================================
*/

export async function updateLastLogin(uid) {

    await updateDoc(

        doc(db, "users", uid),

        {
            lastLogin: serverTimestamp()
        }

    );

}

/*
==================================
GET USER ROLE
==================================
*/

export async function getUserRole(uid) {

    const profile =
        await getUserProfile(uid);

    if (!profile) {

        return "customer";

    }

    return profile.role;

}

/*
==================================
CREATE CUSTOMER
==================================
*/

export async function createCustomer(user, phone = "") {

    await saveUserProfile(user, {

        phone,

        role: "customer",

        provider: "email"

    });

}

/*
==================================
CREATE GOOGLE CUSTOMER
==================================
*/

export async function createGoogleCustomer(user) {

    await saveUserProfile(user, {

        role: "customer",

        provider: "google"

    });

}
/*==================================================
ROUTE PROTECTION & SESSION MANAGER
==================================================*/

/*
==================================
LOAD USER DETAILS
==================================
*/

export function loadUser() {

    onAuthStateChanged(auth, (user) => {

        if (!user) return;

        const userName =
        document.getElementById("userName");

        const userEmail =
        document.getElementById("userEmail");

        const userImage =
        document.getElementById("userImage");

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
                user.photoURL || "images/default-user.png";

        }

    });

}

/*
==================================
MONITOR SESSION
==================================
*/

export function monitorSession(callback = null) {

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            try {

                await updateLastLogin(user.uid);

            }

            catch (error) {

                console.error(error);

            }

            if (callback) {

                callback(user);

            }

        }

    });

}

/*
==================================
PROTECT PAGE
==================================
*/

export function protectPage() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "register.html";
            return;

        }

    });

}

/*
==================================
GUEST ONLY
==================================
*/

export function guestOnly() {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            window.location.href = "index.html";

        }

    });

}

/*
==================================
ADMIN ONLY
==================================
*/

export async function adminOnly() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        const role =
        await getUserRole(user.uid);

        if (role !== "admin") {

            window.location.href = "index.html";

        }

    });

}

/*
==================================
TECHNICIAN ONLY
==================================
*/

export async function technicianOnly() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        const role =
        await getUserRole(user.uid);

        if (role !== "technician") {

            window.location.href = "index.html";

        }

    });

}

/*
==================================
CUSTOMER ONLY
==================================
*/
export {
    auth
};
export async function customerOnly() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        const role =
        await getUserRole(user.uid);

        if (role !== "customer") {

            window.location.href = "index.html";

        }

    });

}






















