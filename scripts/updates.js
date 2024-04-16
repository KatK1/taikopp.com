console.log("updates loaded");

window.onload = function() {
    set100used();
    updateValues();

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
};

function setAccuracyUsed() {
    document.getElementById("accuracy").classList.remove("not-used");
    document.getElementById("100-count").classList.remove("used");
    document.getElementById("accuracy").classList.add("used");
    document.getElementById("100-count").classList.add("not-used");
    console.log("accuracy set as usedInput");
}

function set100used() {
    document.getElementById("accuracy").classList.remove("used");
    document.getElementById("100-count").classList.remove("not-used");
    document.getElementById("accuracy").classList.add("not-used");
    document.getElementById("100-count").classList.add("used");
    console.log("100-count set as usedInput");
}

function uncheck(elem) {
    return function() {
        elem.checked = false;
    }
}

function scaleOD(overallDifficulty) {
    let scalingOD = (document.getElementById("overall-difficulty").value);
    if (document.getElementById("EZ").checked) {
        scalingOD /= 2;
        console.log(scalingOD);
    }
    if (document.getElementById("HR").checked) {
        scalingOD *= 1.4;
        console.log(scalingOD);
    }
    let scaledOD = Math.max(Math.min(scalingOD, 10), 0);
    return scaledOD;
}

function calculateHitTime(overallDifficulty) {
    let scaledOD = scaleOD(document.getElementById("overall-difficulty").value);
    let hitTime300 = 50 - 3 * scaledOD;

    if (document.getElementById("HT").checked) {
        hitTime300 *= 0.75;
    }
    if (document.getElementById("DT").checked) {
        hitTime300 /= 1.5;
    }
    return hitTime300;
};

function inputHandler() {
    let accuracy = document.getElementById("accuracy");
    let count100 = document.getElementById("100-count");

    accuracy.addEventListener("input", setAccuracyUsed);
    count100.addEventListener("input", set100used);

    let boxOD = document.getElementById("overall-difficulty");
    let boxACCURACY = document.getElementById("accuracy");

    if (document.getElementById("impossible-values-toggle").checked) {
        boxOD.max = 9999999999999999999999999999999999999;
        boxACCURACY.max = 9999999999999999999999999999999999999;
    } else {
        var ez = document.getElementById("EZ");
        var dt = document.getElementById("DT");
        var ht = document.getElementById("HT");
        var hr = document.getElementById("HR");

        ez.addEventListener("click", uncheck(hr));
        hr.addEventListener("click", uncheck(ez));
        ht.addEventListener("click", uncheck(dt));
        dt.addEventListener("click", uncheck(ht));
        
        boxOD.max = 10;
        boxACCURACY.max = 100;
    }
}

function updateValues() {
    inputHandler();
    let overallDifficulty = document.getElementById("overall-difficulty").value;
    let odScaled = scaleOD(overallDifficulty);
    odScaled = Math.round(odScaled * 100) / 100;
    let hitTime300 = calculateHitTime(overallDifficulty);

    document.getElementById("hit-time").textContent = "300 Hit Window: " + hitTime300 + "ms";
    document.getElementById("od-scaled").textContent = "OD w/mods: " + odScaled;

    if (document.getElementById('ppv2-toggle').checked) {
        document.getElementById('nfdiv').classList.add("hidden");
        calcPPv3();
    } else {
        document.getElementById('nfdiv').classList.remove("hidden");
        calcPPv2();
    }
    console.log("values updated");
};