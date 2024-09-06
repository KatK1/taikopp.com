console.log("updates loaded");

var ez = document.getElementById("EZ");
var hr = document.getElementById("HR");
var ht = document.getElementById("HT");
var dt = document.getElementById("DT");
var impossibleValuesToggle = document.getElementById("impossible-values-toggle");

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
    document.getElementById("accuracy").classList.remove("used");
    document.getElementById("accuracy").classList.remove("not-used");
    document.getElementById("100-count").classList.remove("used");
    document.getElementById("100-count").classList.remove("not-used");
    document.getElementById("accuracy").classList.add("used");
    document.getElementById("100-count").classList.add("not-used");
    console.log("accuracy set as usedInput");
}

function set100used() {
    document.getElementById("accuracy").classList.remove("used");
    document.getElementById("accuracy").classList.remove("not-used");
    document.getElementById("100-count").classList.remove("used");
    document.getElementById("100-count").classList.remove("not-used");
    document.getElementById("accuracy").classList.add("not-used");
    document.getElementById("100-count").classList.add("used");
    console.log("100-count set as usedInput");
}

function uncheck(elem) {
    return function() {
        if (document.getElementById("impossible-values-toggle").checked) {
            console.log("nothing done to mods");
        } else {
            elem.checked = false;
        }
    }
}

function uncheckImpossibleValues() {
    return function() {
        if (document.getElementById("EZ").checked) {
            hr.checked = false;
        }
        if (document.getElementById("DT").checked) {
            ht.checked = false;
        }
    }
}

function scaleOD() {
    let scalingOD = (document.getElementById("overall-difficulty").value);
    if (document.getElementById("EZ").checked) {
        scalingOD /= 2;
        console.log(scalingOD);
    }
    if (document.getElementById("HR").checked) {
        scalingOD *= 1.4;
        console.log(scalingOD);
    }

    let scaledOD;
    if (document.getElementById("impossible-values-toggle").checked) {
        scaledOD = scalingOD;
    } else {
        scaledOD = Math.max(Math.min(scalingOD, 10), 0);
    }
    
    return Math.round(1000 * scaledOD) / 1000;
}

function calculateHitTime() {
    let scaledOD = scaleOD(document.getElementById("overall-difficulty").value);
    let hitTime300 = 50 - 3 * scaledOD;

    if (document.getElementById("HT").checked) {
        hitTime300 /= 0.75;
    }
    if (document.getElementById("DT").checked) {
        hitTime300 /= 1.5;
    }
    return Math.round(1000 * hitTime300) / 1000;
};

function inputHandler() {
    let accuracy = document.getElementById("accuracy");
    let count100 = document.getElementById("100-count");
    let boxOD = document.getElementById("overall-difficulty");

    accuracy.addEventListener("input", setAccuracyUsed);
    count100.addEventListener("input", set100used);

    if (document.getElementById("impossible-values-toggle").checked) {
        boxOD.max = Number.MAX_SAFE_INTEGER;
        accuracy.max = Number.MAX_SAFE_INTEGER;
    } else {
        ez.addEventListener("click", uncheck(hr));
        hr.addEventListener("click", uncheck(ez));
        ht.addEventListener("click", uncheck(dt));
        dt.addEventListener("click", uncheck(ht));
        
        boxOD.max = 10;
        accuracy.max = 100;
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

    if (document.getElementById("ppv2-toggle").checked) {
        document.getElementById("nfdiv").classList.add("hidden");
        calcPPv3();
    } else {
        document.getElementById("nfdiv").classList.remove("hidden");
        calcPPv2();
    }

    impossibleValuesToggle.addEventListener("click", uncheckImpossibleValues());

    let count100 = document.getElementById("100-count").value;
    let countMiss = document.getElementById("miss-count").value;
    let maxCombo = document.getElementById("max-combo").value;
    let internalAccuracy = Math.round(10000 * (1 - countMiss / (maxCombo - countMiss) - count100 / 2 / (maxCombo - countMiss))) / 100

    document.getElementById("internal-accuracy").textContent = "Rounded Accuracy: " + internalAccuracy +"%";
    console.log("values updated");
};
