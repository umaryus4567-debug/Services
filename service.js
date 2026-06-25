const search =
document.getElementById("serviceSearch");

search.addEventListener(
"input",
() => {

    const keyword =
    search.value.toLowerCase();

    const cards =
    document.querySelectorAll(".card");

    cards.forEach(card => {

        const text =
        card.textContent
        .toLowerCase();

        card.style.display =
        text.includes(keyword)
        ? "block"
        : "none";

    });

});