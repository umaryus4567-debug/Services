import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form =
document.getElementById("contactForm");

form.addEventListener(
"submit",
async (e) => {

    e.preventDefault();

    const name =
    document.getElementById("name").value.trim();

    const email =
    document.getElementById("email").value.trim();

    const phone =
    document.getElementById("phone").value.trim();

    const message =
    document.getElementById("message").value.trim();

    try {

        /* ==========================
           SAVE TO FIREBASE
        ========================== */

        await addDoc(
            collection(
                db,
                "contact-messages"
            ),
            {
                Name: name,
                Email: email,
                Phone: phone,
                Message: message,
                CreatedAt: serverTimestamp()
            }
        );

        /* ==========================
           OPEN WHATSAPP
        ========================== */

        const whatsappMessage =

`📩 New Contact Request

Name: ${name}

Email: ${email}

Phone: ${phone}

Message:
${message}`;

        const whatsappURL =

`https://wa.me/2348163196577?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(
            whatsappURL,
            "_blank"
        );

        /* ==========================
           OPEN GMAIL
        ========================== */

        const emailSubject =
        "New Contact Request";

        const emailBody =

`Name: ${name}

Email: ${email}

Phone: ${phone}

Message:
${message}`;

        const gmailURL =

`mailto:umaryus4567@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        window.location.href =
        gmailURL;

        alert(
        "Message sent successfully ✅"
        );

        form.reset();

    } catch(error) {

        console.log(error);

        alert(
        "Failed to send message ❌"
        );

    }

});