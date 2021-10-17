const belts = {
    LCPL: [
        ['MMA', 'UNQUAL'],
        ['MMB', 'TAN'],
        ['MMC', 'GRAY'],
        ['MMD', 'GREEN']
    ],
    CPL: [
        ['MME', 'GREEN INSTRUCTOR'],
        ['MMF', 'BROWN'],
        ['MMG+', 'BROWN INSTRUCTOR OR ABOVE']
    ]
}

// MCMAP
const mcmapBelt = document.getElementById('mcmapBelt');
const mcmapBeltValue = document.getElementById('mcmapBeltValue');
mcmapBelt.addEventListener('change', updateMcmap);

function updateMcmap(e){
    console.log(mcmapBelt.value);
    fetch('/belt/' + rankSelector.value + '/' + mcmapBelt.value)
        .then(response => response.json())
        .then(data => {
            mcmapBeltValue.innerHTML = data['Score'];
            warCalculateTotal();
        })
}

//rankSelector
const rankSelector = document.getElementById("rankSelector");
rankSelector.addEventListener('change', updateRank);

function updateRank(e){
    if (rankSelector.value == "Cpl"){
        belts["CPL"].forEach(element => {
            var opt = document.createElement('option');
            opt.value = element[0];
            opt.innerHTML = element[0] + ' - ' + element[1];
            mcmapBelt.appendChild(opt);
        });
    } else {
        while (mcmapBelt.firstChild) {
            mcmapBelt.removeChild(mcmapBelt.firstChild);
        }

        belts["LCPL"].forEach(element => {
            var opt = document.createElement('option');
            opt.value = element[0];
            opt.innerHTML = element[0] + ' - ' + element[1];
            mcmapBelt.appendChild(opt);
        });
    }
}

// rangeDestroys
// rangeDrills
const rangeDestroys = document.getElementById('rangeDestroys');
const rangeDrills = document.getElementById('rangeDrills');
const rangeScore = document.getElementById('rangeScore');

rangeDestroys.addEventListener('change', updateRange);
rangeDrills.addEventListener('change', updateRange);

function updateRange(e){
    if (rangeDestroys.value && rangeDrills.value){
        fetch('/range/' + rangeDestroys.value + '/' + rangeDrills.value)
            .then(response => response.json())
            .then(data => {
                rangeScore.innerHTML = data['Score']
                rangeScore.classList.remove('btn-outline-danger');
                rangeScore.classList.add('btn-outline-success');
                warCalculateTotal();
            })
            .catch(error => {
                rangeScore.innerHTML = '<i class="fas fa-exclamation"></i>'
                rangeScore.classList.add('btn-outline-danger');
                rangeScore.classList.remove('btn-outline-success');
            })
    }
}

function warCalculateTotal(){
    let _range = Number.isInteger(rangeScore.innerHTML) ? 0 : rangeScore.innerHTML;
    let _belt = Number.isInteger(mcmapBeltValue.innerHTML) ? 0 : mcmapBeltValue.innerHTML;

    warCalculation.value = "( " + _range + " + "  + _belt + " ) x 1.25";
    warTotal.innerHTML = (parseInt(_range) + parseInt(_belt)) * 1.25;
    warTotalBoard.innerHTML = warTotal.innerHTML;
    warPercBoard.innerHTML = Math.round( (warTotal.innerHTML / 250) * 100) + '%';
    calculateJepes()
    
}




// PFT Updater
const pftScore = document.getElementById('pftScore');
const pftScoreJValue = document.getElementById('J_pftScore');

pftScore.addEventListener('change', updatePFT);

function updatePFT(e) {

    fetch('/pft/'+ rankSelector.value + '/' + pftScore.value)
        .then(response => response.json())
        .then(data => {
            pftScoreJValue.innerHTML = data["Score"]
            pftScoreJValue.classList.add("is-valid")
            pftScoreJValue.classList.add('btn-outline-success')
            pftScoreJValue.classList.remove('btn-outline-danger')
            calculateTotal()
        })
        .catch(error => {
            //console.log(error);
            pftScoreJValue.innerHTML = '<i class="bi bi-exclamation-lg"></i>'
            pftScoreJValue.classList.add('btn-outline-danger')
            pftScoreJValue.classList.remove('btn-outline-success')
        });
}


// CFT Updater
const cftScore = document.getElementById('cftScore');
const cftScoreJValue = document.getElementById('J_cftScore');
const physicalTotalBoard = document.getElementById('physicalTotalBoard');
const physicalPercBoard = document.getElementById('physicalPercBoard');

cftScore.addEventListener('change', updateCFT);

function updateCFT(e) {
    
    fetch('/cft/'+ rankSelector.value + '/' + cftScore.value)
        .then(response => response.json())
        .then(data => {
            cftScoreJValue.innerHTML = data["Score"]
            cftScoreJValue.classList.add("is-valid")
            cftScoreJValue.classList.add('btn-outline-success')
            cftScoreJValue.classList.remove('btn-outline-danger')
            calculateTotal()
        })
        .catch(error => {
            //console.log(error);
            cftScoreJValue.innerHTML = '<i class="bi bi-exclamation-lg"></i>'
            cftScoreJValue.classList.add('btn-outline-danger')
            cftScoreJValue.classList.remove('btn-outline-success')
        });
}

function calculateTotal(){
    let pft = Number.isInteger(pftScoreJValue.innerHTML) ? 0 : pftScoreJValue.innerHTML;
    let cft = Number.isInteger(cftScoreJValue.innerHTML) ? 0 : cftScoreJValue.innerHTML;

    physicalCalculation.value = "( " + pft + " + "  + cft + " ) x 1.25";
    physicalTotal.innerHTML = (parseInt(pft) + parseInt(cft)) * 1.25;

    physicalTotalBoard.innerHTML = physicalTotal.innerHTML
    physicalPercBoard.innerHTML = Math.round( (physicalTotalBoard.innerHTML / 250) * 100) + '%';
    calculateJepes()
}

// Bonus Selectors

// Drill Instructor
const bonus_DICheck = document.getElementById('bonus_DICheck');
const bonus_DICheckValue = document.getElementById('bonus_DICheckValue');

bonus_DICheck.addEventListener('click', DICheckUpdater);

function DICheckUpdater(e) {
    bonus_DICheckValue.innerHTML = bonus_DICheck.checked ? '50':'0';
    totalBonus()
}

// Recruiter
const bonus_RecruiterCheck = document.getElementById('bonus_RecruiterCheck');
const bonus_RecruiterCheckValue = document.getElementById('bonus_RecruiterCheckValue');

bonus_RecruiterCheck.addEventListener('click', RecruiterCheckUpdater);

function RecruiterCheckUpdater(e) {
    bonus_RecruiterCheckValue.innerHTML = bonus_RecruiterCheck.checked ? '50':'0';
    totalBonus()
}

// Security Guard
const bonus_SecurityGuardCheck = document.getElementById('bonus_SecurityGuardCheck');
const bonus_SecurityGuardCheckValue = document.getElementById('bonus_SecurityGuardCheckValue');

bonus_SecurityGuardCheck.addEventListener('click', SecurityGuardCheckUpdater);

function SecurityGuardCheckUpdater(e) {
    bonus_SecurityGuardCheckValue.innerHTML = bonus_SecurityGuardCheck.checked ? '50':'0';
    totalBonus()
}

// Combat Instructor
const bonus_CombatInstructorCheck = document.getElementById('bonus_CombatInstructorCheck');
const bonus_CombatInstructorCheckValue = document.getElementById('bonus_CombatInstructorCheckValue');

bonus_CombatInstructorCheck.addEventListener('click', CombatInstructorCheckCheckUpdater);

function CombatInstructorCheckCheckUpdater(e) {
    bonus_CombatInstructorCheckValue.innerHTML = bonus_CombatInstructorCheck.checked ? '50':'0';
    totalBonus()
}

// Marine Security Forces
const bonus_MCSFCheck = document.getElementById('bonus_MCSFCheck');
const bonus_MCSFCheckValue = document.getElementById('bonus_MCSFCheckValue');

bonus_MCSFCheck.addEventListener('click', MCSFCheckUpdater);

function MCSFCheckUpdater(e) {
    bonus_MCSFCheckValue.innerHTML = bonus_MCSFCheck.checked ? '50':'0';
    totalBonus()
}

const bonus_command = document.getElementById('bonus_command')
const bonus_commandValue = document.getElementById('bonus_commandValue')

bonus_command.addEventListener('change', CommandBonusUpdater)

function CommandBonusUpdater(e){
    if (bonus_command.checkValidity()){
        bonus_commandValue.innerHTML = bonus_command.value * 20;
        bonus_commandValue.classList.add('btn-outline-success')
        bonus_commandValue.classList.remove('btn-outline-danger')
        totalBonus()
    } else {
        bonus_commandValue.classList.remove('btn-outline-success')
        bonus_commandValue.classList.add('btn-outline-danger')
        bonus_commandValue.innerHTML = '<i class="bi bi-exclamation-lg"></i>'
    }
}

function totalBonus(){
    let a = bonus_DICheckValue.innerHTML
    let b = bonus_RecruiterCheckValue.innerHTML
    let c = bonus_SecurityGuardCheckValue.innerHTML
    let d = bonus_CombatInstructorCheckValue.innerHTML
    let e = bonus_MCSFCheckValue.innerHTML
    let f = bonus_commandValue.innerHTML
    //bonusCalculation
    //bonusCalculationTotal
    total = parseInt(a) + parseInt(b) + parseInt(c) + parseInt(d) + parseInt(e) + parseInt(f);
    bonusCalculation.value = "( "+a+" + "+b+" + "+c+" + "+d+" + "+e+" + "+f+" ) < 100";

    if (total > 100){
        total = 100;
    }
    bonusCalculationTotal.innerHTML = total;
    bonusTotalBoard.innerHTML = total;
    bonusPercBoard.innerHTML = Math.round((total / 100) * 100) + '%';
    calculateJepes()
}

// Command Input
const MOSMSNScore = document.getElementById('MOSMSNScore')
const MOSMSNScoreValue = document.getElementById('MOSMSNScoreValue')

MOSMSNScore.addEventListener('change', MOSMSNUpdater)

function MOSMSNUpdater(e){
    if (MOSMSNScore.value >= 0 && MOSMSNScore.value <= 5){
        MOSMSNScoreValue.innerHTML = Math.round(MOSMSNScore.value * 50)
        commandCalculationUpdater()
    }
}

const LeadershipScore = document.getElementById('LeadershipScore')
const LeadershipScoreValue = document.getElementById('LeadershipScoreValue')

LeadershipScore.addEventListener('change', LeadershipUpdater)

function LeadershipUpdater(e){
    if (LeadershipScore.value >= 0 && LeadershipScore.value <= 5){
        LeadershipScoreValue.innerHTML = Math.round(LeadershipScore.value * 50)
        commandCalculationUpdater()
    }
}

const CharacterScore = document.getElementById('CharacterScore')
const CharacterScoreValue = document.getElementById('CharacterScoreValue')

CharacterScore.addEventListener('change', CharacterUpdater)


function CharacterUpdater(e){
    if (CharacterScore.value >= 0 && CharacterScore.value <= 5){
        CharacterScoreValue.innerHTML = Math.round(CharacterScore.value * 50)
        commandCalculationUpdater()
    }
}


const commandCalculation = document.getElementById('commandCalculation')
const commandCalculationTotal = document.getElementById('commandCalculationTotal')


const commandTotalBoard = document.getElementById('commandTotalBoard');
const commandPercBoard = document.getElementById('commandPercBoard');

function commandCalculationUpdater(e){
    let a = parseFloat(MOSMSNScoreValue.innerHTML) ? parseFloat(MOSMSNScoreValue.innerHTML) : 0;
    let b = parseFloat(LeadershipScoreValue.innerHTML) ? parseFloat(LeadershipScoreValue.innerHTML) : 0;
    let c = parseFloat(CharacterScoreValue.innerHTML) ? parseFloat(CharacterScoreValue.innerHTML) : 0;

    if (a && b && c){
        commandCalculation.value = "( " + a +" + " + b + " + " + c + " ) / 3";
        commandCalculationTotal.innerHTML = Math.round((a + b + c) / 3);

        commandTotalBoard.innerHTML = commandCalculationTotal.innerHTML;
        commandPercBoard.innerHTML = Math.round((commandCalculationTotal.innerHTML / 250) * 100) + '%';
        calculateJepes()
    }

}

const MOSandQualsSelector = document.getElementById('MOSandQualsSelector')
const MOSandQualsValue = document.getElementById('MOSandQualsValue')

MOSandQualsSelector.addEventListener('change', MOSandQualsEvent)

function MOSandQualsEvent(e){
    MOSandQualsValue.innerHTML = MOSandQualsSelector.value;
}

const degreeSelector = document.getElementById('degreeSelector')
const degreeValue = document.getElementById('degreeValue')

degreeSelector.addEventListener('change', degreeEvent)

function degreeEvent(e){
    degreeValue.innerHTML = degreeSelector.value;
}

function calculateJepes(){
    let a = warTotalBoard.innerHTML
    let b = physicalTotalBoard.innerHTML
    //let c = 
    let d = commandPercBoard.innerHTML
    let e = bonusPercBoard.innerHTML
    jepesTotalBoard.innerHTML = parseFloat(a) + parseFloat(b) + parseFloat(d) + parseFloat(e);
    jepesPercBoard.innerHTML = Math.round((parseInt(jepesTotalBoard.innerHTML) / 1000) * 100) + '%';
}