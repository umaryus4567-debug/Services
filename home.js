import {
    auth,
    protectPage,
    loadUser,
    logoutUser
} from "./auth-utils.js";

import {
    listenForNotifications,
    markAllNotificationsAsRead
} from "./notification-utils.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

console.log("home.js started");

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "register.html";
        return;

    }

});


console.log("home JS Loaded Successfully");


const notificationButton =
document.getElementById("notificationButton");

const notificationCount =
document.getElementById("notificationCount");

const notificationList =
document.getElementById("notificationList");

const userName =
document.getElementById("userName");

const userEmail =
document.getElementById("userEmail");

const userImage =
document.getElementById("userImage");

const notificationDropdown =
document.getElementById("notificationDropdown");

const logoutButton =
document.getElementById("logoutButton");

protectPage();

loadUser();


function formatNotificationTime(timestamp){

    if(!timestamp) return "";

    const date =
    timestamp.toDate();

    const now =
    new Date();

    const seconds =
    Math.floor((now-date)/1000);

    if(seconds<60){

        return "Just now";

    }

    if(seconds<3600){

        return Math.floor(seconds/60)+" min ago";

    }

    if(seconds<86400){

        return Math.floor(seconds/3600)+" hrs ago";

    }

    if(seconds<604800){

        return Math.floor(seconds/86400)+" days ago";

    }

    return date.toLocaleDateString();

}



    onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    listenForNotifications(user.uid, (notifications) => {

        notificationList.innerHTML = "";

        if (notifications.length === 0) {

            notificationCount.textContent = "";

            notificationList.innerHTML = `
                <div class="empty-notification">
                    No notifications yet.
                </div>
            `;

            return;

        }

        const unread =
        notifications.filter(n => !n.read).length;

        notificationCount.textContent =
        unread || "";

        notifications.forEach(notification => {

            notificationList.innerHTML += `
                <div class="notification-card">
                    <div class="notification-title">
                        ${notification.title}
                    </div>

                    <div class="notification-message">
                        ${notification.message}
                    </div>
                </div>
            `;

        });

    });

});

document
.querySelectorAll(".notification-card")
.forEach(card => {

    card.addEventListener("click", () => {

        const link = card.dataset.link;

        if(link){

            window.location.href = link;

        }

    });

});


if (notificationButton) {

    notificationButton.addEventListener("click", async () => {

        notificationDropdown.classList.toggle("show");

        const user = auth.currentUser;

        if(user){

            await markAllNotificationsAsRead(user.uid);

        }

    });

}


window.addEventListener("load", () => {

    console.log(
        "Campus Electrical Support Loaded Successfully"
    );

});

if(logoutButton){

    logoutButton.addEventListener("click",()=>{

        logoutUser();

    });

}

document.addEventListener("click",(e)=>{

    if(

    notificationDropdown &&
    notificationButton &&
    !notificationDropdown.contains(e.target) &&
    !notificationButton.contains(e.target)

){

        notificationDropdown.classList.remove("show");

    }

});