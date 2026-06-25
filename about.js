const counters =
document.querySelectorAll(".stat-box h2");

counters.forEach(counter => {

    const target =
    parseInt(counter.innerText);

    if(isNaN(target)) return;

    let count = 0;

    const update = () => {

        count += Math.ceil(target / 50);

        if(count >= target){
            counter.innerText = target + "+";
        } else {
            counter.innerText = count;
            requestAnimationFrame(update);
        }
    };

    update();
});