window.addEventListener("DOMContentLoaded", function() {
    setActive("accuracy");
    updateValues();
    calcPP();

    var ez = document.getElementById("EZ");
    var dt = document.getElementById("DT");
    var ht = document.getElementById("HT");
    var hr = document.getElementById("HR");

    ez.addEventListener("click", uncheck(hr));
    hr.addEventListener("click", uncheck(ez));
    ht.addEventListener("click", uncheck(dt));
    dt.addEventListener("click", uncheck(ht));

    var inputs = document.getElementsByTagName("input");

    for (var i in inputs) {
        switch (inputs[i].type) {
            case "number":
                inputs[i].addEventListener("input", updateValues);
                break;
            case "checkbox":
                inputs[i].addEventListener("click", updateValues);
                break;
        }
    }
});

function setActive(name) {
    activeInput = name;
    if (name == "accuracy") {
        document.getElementById("accuracy").classList.remove("inactive");
        document.getElementById("100-count").classList.remove("active");
        document.getElementById("accuracy").classList.add("active");
        document.getElementById("100-count").classList.add("inactive");
    } else {
        document.getElementById("accuracy").classList.remove("active");
        document.getElementById("100-count").classList.remove("inactive");
        document.getElementById("accuracy").classList.add("inactive");
        document.getElementById("100-count").classList.add("active");
    }
}

function uncheck(elem) {
    return function() {
        elem.checked = false;
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
        document.getElementById('nfdiv').classList.add("invisible");
        calcPP();
    } else {
        document.getElementById('nfdiv').classList.remove("invisible");
        calcPPv1();
    }
};