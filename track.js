import { db }
from "./firebase-config.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const searchBtn =
document.getElementById("searchBtn");

const result =
document.getElementById("result");

searchBtn.addEventListener(
"click",
async () => {

const searchValue =
document
.getElementById("searchInput")
.value
.trim();

if(!searchValue){

alert(
"Enter Phone Number or Request ID"
);

return;
}

result.innerHTML =
"<p>Searching...</p>";

try{

/* SEARCH BY REQUEST ID */

const requestDoc =
await getDoc(
doc(
db,
"service-request",
searchValue
)
);

if(requestDoc.exists()){

const data =
requestDoc.data();

result.innerHTML =
buildCard(
data,
requestDoc.id
);

return;
}

/* SEARCH BY PHONE */

const q =
query(
collection(
db,
"service-request"
),
where(
"Phone",
"==",
searchValue
)
);

const snapshot =
await getDocs(q);

result.innerHTML = "";

if(snapshot.empty){

result.innerHTML = `

<div class="result-card">

<h3>No Request Found</h3>

<p>
No request exists for this phone number or Request ID.
</p>

</div>

`;

return;
}

snapshot.forEach(docItem => {

const data =
docItem.data();

result.innerHTML +=
buildCard(
data,
docItem.id
);

});

}catch(error){

console.log(error);

result.innerHTML = `

<div class="result-card">

<h3>Error</h3>

<p>
Failed to retrieve request.
</p>

</div>

`;

}

});

function buildCard(data,id){

let date = "";

if(data.CreatedAt){

date =
data.CreatedAt
.toDate()
.toLocaleString();
}

return `

<div class="result-card">

<h3>
${data.Customername || ""}
</h3>

<div class="request-id">

<b>Request ID:</b>
${id}

</div>

<p>

<b>Phone:</b>
${data.Phone || ""}

</p>

<p>

<b>Location:</b>
${data.Location || ""}

</p>

<p>

<b>Description:</b>
${data.Description || ""}

</p>

<p>

<b>Urgency:</b>
${data.Urgency || ""}

</p>

<p>

<b>Date Submitted:</b>
${date}

</p>

<p>

<b>Technician:</b>
${data.Technician || "Not Assigned Yet"}

</p>

<div
class="status-badge ${getStatusClass(data.Status)}">

${data.Status || "Pending"}

</div>

</div>

`;
}

function getStatusClass(status){

switch(status){

case "Accepted":
return "accepted";

case "Declined":
return "declined";

case "Completed ✅":
return "completed";

default:
return "pending";
}

}