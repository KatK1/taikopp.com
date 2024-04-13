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
        hitTime300 /= 0.75;
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

function calcPP() {
    let starRating = document.getElementById("star-rating").value;
    let maxCombo = document.getElementById("max-combo").value;
    let countMiss = document.getElementById("miss-count").value;
    let countHit = maxCombo - countMiss; 
    let accuracy = document.getElementById("accuracy").value;
    let hitTime300 = calculateHitTime(document.getElementById("overall-difficulty").value);
    let count100 = -1;

    if (activeInput == "accuracy") {
        count100 = Math.round((1 - countMiss / countHit - accuracy / 100) * 2 * countHit);
        document.getElementById("100-count").value = count100;
    } else {
        count100 = document.getElementById("100-count").value;
        accuracy = 100 * (1 - countMiss / countHit - count100 / 2 / countHit);
        document.getElementById("accuracy").value = Math.round(accuracy * 100) / 100;
    }

    if (starRating < 0 || countHit <= 0 || countMiss < 0 || countHit < 0 || accuracy < 0 || accuracy > 100 || hitTime300 < 0 ||
        (countMiss + count100) > countHit || count100 < 0) {
        document.getElementById("pp-value").innerHTML = "Something is wrong with at least one inputs."
        return;
    }

    const effectiveMissCount = Math.max(1.0, 1000.0 / countHit) * countMiss;

    let strainValue = Math.pow(5 * Math.max(1.0, starRating / 0.115) - 4.0, 2.25) / 1150.0;
    let strainLengthBonus = 1 + 0.1 * Math.min(1.0, countHit / 1500.0);
    let accLengthBonus = Math.min(1.15, Math.pow(countHit / 1500.0, 0.3))

    strainValue *= strainLengthBonus;
    strainValue *= Math.pow(0.986, effectiveMissCount);
    strainValue *= Math.pow(accuracy / 100, 2.0);

    let accValue = Math.pow(60.0 / hitTime300, 1.1) * Math.pow(accuracy / 100, 8.0) * Math.pow(starRating, 0.4) * 27.0;
    accValue *= Math.min(Math.pow(countHit / 1500, 0.3), 1.15);

    let globalMultiplier = 1.13;
    if (document.getElementById("HD").checked) {
        globalMultiplier *= 1.075
        strainValue *= 1.025
    }

    if (document.getElementById("EZ").checked) {
        globalMultiplier *= 0.975
        strainValue *= 0.985
    }

    if (document.getElementById("FL").checked) {
        strainValue *= 1.05 * strainLengthBonus
    }

    if (document.getElementById("HR").checked) {
        strainValue *= 1.05
    }

    if (document.getElementById("HD").checked && document.getElementById("FL").checked) {
        accValue *= Math.max(1.050, 1.075 * accLengthBonus);
    }

    let totalValue = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accValue, 1.1), 1.0 / 1.1) * globalMultiplier;

    document.getElementById("pp-value").innerHTML = Math.round(totalValue * 1000) / 1000 + " pp";
};

function calcPPv1() {
    let starRating = document.getElementById("star-rating").value;
    let maxCombo = document.getElementById("max-combo").value;
    let countMiss = document.getElementById("miss-count").value;
    let countHit = maxCombo - countMiss; 
    let accuracy = document.getElementById("accuracy").value;
    let hitTime300 = calculateHitTime(document.getElementById("overall-difficulty").value);
    let count100 = -1;

    if (activeInput == "accuracy") {
        count100 = Math.round((1 - countMiss / countHit - accuracy / 100) * 2 * countHit);
        document.getElementById("100-count").value = count100;
    } else {
        count100 = document.getElementById("100-count").value;
        accuracy = 100 * (1 - countMiss / countHit - count100 / 2 / countHit);
        document.getElementById("accuracy").value = Math.round(accuracy * 100) / 100;
    }

    if (starRating < 0 || maxCombo <= 0 || countMiss < 0 || countHit < 0 || accuracy < 0 || accuracy > 100 || hitTime300 < 0 ||
        (countMiss + count100) > countHit || count100 < 0) {
        document.getElementById("pp-value").innerHTML = "Something is wrong with at least one inputs."
        return;
    }

    let strainValue = Math.pow(5.0 * Math.max(1.0, starRating / 0.0075) - 4.0, 2.0) / 100000.0;
    let strainLengthBonus = 1 + 0.1 * Math.min(1.0, maxCombo / 1500.0);

    strainValue *= strainLengthBonus;
    strainValue *= Math.pow(0.985, countMiss);
    strainValue *= Math.min(Math.pow(countHit, 0.5) / Math.pow(maxCombo, 0.5), 1.0);
    strainValue *= (accuracy / 100);
    
    if (hitTime300 == 0) { 
        var accValue = 0 
    } else { 
        var accValue = Math.pow(150 / hitTime300, 1.1) * Math.pow(accuracy / 100, 15.0) * 22.0;
        accValue *= Math.min(1.15, Math.pow(countHit / 1500, 0.3));
    }

    let globalMultiplier = 1.1;

    if (document.getElementById("HD").checked) {
        globalMultiplier *= 1.1;
        strainValue *= 1.025;
    };

    if (document.getElementById("FL").checked) {
        strainValue *= 1.05 * strainLengthBonus;
    };

    if (document.getElementById("NF").checked) {
        globalMultiplier *= 0.9;
    };

    let totalValue = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accValue, 1.1), 1.0 / 1.1) * globalMultiplier;

    document.getElementById("pp-value").innerHTML = Math.round(totalValue * 1000) / 1000 + " pp";
};