console.log("ppcalc loaded");

function calcPPv3() {
    console.log("calcPPv3() ran");
    var starRating = document.getElementById("star-rating").value;
    var maxCombo = document.getElementById("max-combo").value;
    var countMiss = document.getElementById("miss-count").value;
    var countHit = maxCombo - countMiss; 
    var accuracy = document.getElementById("accuracy").value;
    var hitTime300 = calculateHitTime(scaleOD(document.getElementById("overall-difficulty").value));
    var count100 = document.getElementById("100-count").value;

    if (document.getElementById("accuracy").classList.contains("used")) {
        count100 = Math.round((1 - countMiss / countHit - accuracy / 100) * 2 * countHit);
        document.getElementById("100-count").value = count100;
    } else {
        count100 = document.getElementById("100-count").value;
        accuracy = 100 * (1 - countMiss / countHit - count100 / 2 / countHit);
        document.getElementById("accuracy").value = Math.round(accuracy * 100) / 100;
    }

    if (!document.getElementById("impossible-values-toggle").checked) {
        if (starRating < 0 || countHit <= 0 || countMiss < 0 || countHit < 0 || accuracy < 0 || accuracy > 100 || hitTime300 < 0 ||
            (countMiss + count100) > countHit || count100 < 0) {
            document.getElementById("pp-value").innerHTML = "Something is wrong with at least one inputs."
            return;
        }
    }

    const effectiveMissCount = Math.max(1.0, 1000.0 / countHit) * countMiss;

    var strainValue = Math.pow(5 * Math.max(1.0, starRating / 0.115) - 4.0, 2.25) / 1150.0;
    var strainLengthBonus = 1 + 0.1 * Math.min(1.0, countHit / 1500.0);

    strainValue *= strainLengthBonus;
    strainValue *= Math.pow(0.986, effectiveMissCount);
    strainValue *= Math.pow(accuracy / 100, 2.0);

    if (hitTime300 <= 0 && !document.getElementById("impossible-values-toggle").checked) {
        var accValue = 0;
    } else {
        var accValue = Math.pow(60.0 / hitTime300, 1.1) * Math.pow(accuracy / 100, 8.0) * Math.pow(starRating, 0.4) * 27.0;
        var accLengthBonus = Math.min(Math.pow(countHit / 1500, 0.3), 1.15);
        accValue *= accLengthBonus;
    }

    var globalMultiplier = 1.13;

    if (document.getElementById("HD").checked) {
        globalMultiplier *= 1.075
        strainValue *= 1.025
    }

    if (document.getElementById("EZ").checked) {
        globalMultiplier *= 0.975
        strainValue *= 0.985
    }

    if (document.getElementById("FL").checked) {
        strainValue *= (1.05 * strainLengthBonus)
    }

    if (document.getElementById("HR").checked) {
        strainValue *= 1.05
    }

    if (document.getElementById("HD").checked && document.getElementById("FL").checked) {
        accValue *= Math.max(1.050, 1.075 * accLengthBonus);
    }

    var totalValue = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accValue, 1.1), 1.0 / 1.1) * globalMultiplier;

    document.getElementById("pp-value").innerHTML = Math.round(totalValue * 1000) / 1000 + "pp";
};

function calcPPv2() {
    console.log("calcPPv2() ran");
    var starRating = document.getElementById("star-rating").value;
    var maxCombo = document.getElementById("max-combo").value;
    var countMiss = document.getElementById("miss-count").value;
    var countHit = maxCombo - countMiss; 
    var accuracy = document.getElementById("accuracy").value;
    var hitTime300 = calculateHitTime(scaleOD(document.getElementById("overall-difficulty").value));
    var count100 = document.getElementById("100-count").value;

    if (document.getElementById("accuracy").classList.contains("used")) {
        count100 = Math.round((1 - countMiss / countHit - accuracy / 100) * 2 * countHit);
        document.getElementById("100-count").value = count100;
    } else {
        count100 = document.getElementById("100-count").value;
        accuracy = 100 * (1 - countMiss / countHit - count100 / 2 / countHit);
        document.getElementById("accuracy").value = Math.round(accuracy * 100) / 100;
    }

    if (!document.getElementById("impossible-values-toggle").checked) {
        if (starRating < 0 || maxCombo <= 0 || countMiss < 0 || countHit < 0 || accuracy < 0 || accuracy > 100 || hitTime300 < 0 ||
            (countMiss + count100) > countHit || count100 < 0) {
            document.getElementById("pp-value").innerHTML = "Something is wrong with at least one inputs."
            return;
        }
    }

    var strainValue = Math.pow(5.0 * Math.max(1.0, starRating / 0.0075) - 4.0, 2.0) / 100000.0;
    var strainLengthBonus = 1 + 0.1 * Math.min(1.0, maxCombo / 1500.0);

    strainValue *= strainLengthBonus;
    strainValue *= Math.pow(0.985, countMiss);
    strainValue *= Math.min(Math.pow(countHit, 0.5) / Math.pow(maxCombo, 0.5), 1.0);
    strainValue *= (accuracy / 100);
    
    if (hitTime300 <= 0) { 
        var accValue = 0 
    } else { 
        var accValue = Math.pow(150 / hitTime300, 1.1) * Math.pow(accuracy / 100, 15.0) * 22.0;
        var accLengthBonus = Math.min(1.15, Math.pow(countHit / 1500, 0.3));
        accValue * accLengthBonus;
    }

    var globalMultiplier = 1.1;

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

    var totalValue = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accValue, 1.1), 1.0 / 1.1) * globalMultiplier;

    document.getElementById("pp-value").innerHTML = Math.round(totalValue * 1000) / 1000 + " pp";
};