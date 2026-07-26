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

const notificationButton =
document.getElementById("notificationButton");

const notificationDropdown =
document.getElementById("notificationDropdown");

const notificationCount =
document.getElementById("notificationCount");

const notificationList =
document.getElementById("notificationList");

const logoutButton =
document.getElementById("logoutButton");

protectPage();

loadUser();
onAuthStateChanged(auth, (user) => {

    if (!user) return;

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
        unread > 0 ? unread : "";

        notifications.forEach(notification => {

            notificationList.innerHTML += `

                <div class="notification-card ${notification.read ? "" : "unread"}">

                    <div class="notification-title">

                        <i class="fa-solid ${notification.icon}"></i>

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
if (notificationButton) {

    notificationButton.addEventListener("click", async () => {

        notificationDropdown.classList.toggle("show");

        const user = auth.currentUser;

        if (user) {

            await markAllNotificationsAsRead(user.uid);

        }

    });
    
    if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await logoutUser();

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

        }

    });

}

document.addEventListener("click", (e) => {

    if (

        notificationDropdown &&
        notificationButton &&
        !notificationDropdown.contains(e.target) &&
        !notificationButton.contains(e.target)

    ) {

        notificationDropdown.classList.remove("show");

    }

});

window.addEventListener("load", () => {

    console.log("================================");
    console.log("UY Power Home Ready");
    console.log("Notifications Ready");
    console.log("================================");

});

}