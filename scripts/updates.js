console.log("updates loaded");

window.onload = function() {
    console.log("loading listener");
    setActive("accuracy");
    console.log("set accuracy as input");
    updateValues();
    console.log("updated values");
    calcPP();

    var ez = document.getElementById("EZ");
    var dt = document.getElementById("DT");
    var ht = document.getElementById("HT");
    var hr = document.getElementById("HR");

    ez.addEventListener("click", uncheck(hr));
    console.log("EventListener1 added");
    hr.addEventListener("click", uncheck(ez));
    console.log("EventListener2 added");
    ht.addEventListener("click", uncheck(dt));
    console.log("EventListener3 added");
    dt.addEventListener("click", uncheck(ht));
    console.log("EventListener4 added");

    var inputs = document.getElementsByTagName("input");

    for (var i in inputs) {
        switch (inputs[i].type) {
            case "number":
                inputs[i].addEventListener("input", updateValues);
                console.log("EventListener5 added");
                break;
            case "checkbox":
                inputs[i].addEventListener("click", updateValues);
                console.log("EventListener6 added");
                break;
        }
    }
};

function setActive(name) {
    activeInput = name;
    if (name == "accuracy") {
        document.getElementById("accuracy").classList.remove("inactive");
        document.getElementById("100-count").classList.remove("active");
        document.getElementById("accuracy").classList.add("active");
        document.getElementById("100-count").classList.add("inactive");
        console.log("accuracy set as activeInput");
    } else {
        document.getElementById("accuracy").classList.remove("active");
        document.getElementById("100-count").classList.remove("inactive");
        document.getElementById("accuracy").classList.add("inactive");
        document.getElementById("100-count").classList.add("active");
        console.log("100-count set as activeInput");
    }
}

function uncheck(elem) {
    return function() {
        elem.checked = false;
        console.log("uncheck");
    }
}

function scaleOD(overallDifficulty) {
    if (document.getElementById("EZ").checked) {
        overallDifficulty /= 2;
    }
    if (document.getElementById("HR").checked) {
        overallDifficulty *= 1.4;
    }
    overallDifficulty = Math.max(Math.min(overallDifficulty, 10), 0);
    console.log("od scaled");
    return overallDifficulty;
}

function calculateHitTime(overallDifficulty) {
    overallDifficulty = scaleOD(overallDifficulty);
    var hitTime300 = 50 - 3 * overallDifficulty;

    if (document.getElementById("HT").checked) {
        hitTime300 *= 0.75;
    }
    if (document.getElementById("DT").checked) {
        hitTime300 /= 1.5;
    }
    console.log("hit time calculated");
    return Math.round(hitTime300 * 100) / 100;
};

function updateValues() {
    let overallDifficulty = document.getElementById("overall-difficulty").value;
    var odScaled = scaleOD(overallDifficulty);
    odScaled = Math.round(odScaled * 100) / 100;
    var hitTime300 = calculateHitTime(odScaled);

    document.getElementById("hit-time").textContent = "300 Hit Window: " + hitTime300 + "ms";
    document.getElementById("od-scaled").textContent = "OD w/mods: " + odScaled;

    if (document.getElementById('btn-check-outlined').checked) {
        document.getElementById('nfdiv').classList.add("hidden");
        calcPP();
    } else {
        document.getElementById('nfdiv').classList.remove("hidden");
        calcPPv1();
    }
    console.log("values updated");
};