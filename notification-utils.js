import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const db = getFirestore(app);

/*
====================================
CREATE NOTIFICATION
====================================
*/

export async function createNotification({

    uid,
    title,
    message,
    type = "info",
    icon = "fa-circle-info",
    sender = "system",
    link = "index.html"

}) {

    try {

        await addDoc(collection(db, "notifications"), {

            uid,
            title,
            message,
            type,
            icon,
            sender,
            link,
            read: false,
            createdAt: serverTimestamp()

        });

    } catch (error) {

        console.error("Notification Error:", error);

    }

}

/*
====================================
LISTEN FOR NOTIFICATIONS
====================================
*/

export function listenForNotifications(uid, callback) {

    const q = query(

        collection(db, "notifications"),

        where("uid", "==", uid),

        orderBy("createdAt", "desc")

    );

    return onSnapshot(q, (snapshot) => {

        const notifications = [];

        snapshot.forEach((doc) => {

            notifications.push({

                id: doc.id,

                ...doc.data()

            });

        });

        callback(notifications);

    });

}

/*
====================================
MARK ALL AS READ
====================================
*/

export async function markAllNotificationsAsRead(uid) {

    const q = query(

        collection(db, "notifications"),

        where("uid", "==", uid),

        where("read", "==", false)

    );

    const snapshot = await getDocs(q);

    for (const notification of snapshot.docs) {

        await updateDoc(

            doc(db, "notifications", notification.id),

            {

                read: true

            }

        );

    }

}