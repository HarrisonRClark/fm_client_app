const seedDataKey = 'seedData';


function dispatchSeedDataLoadedEvent(seedData) {
    const event = new CustomEvent('SeedDataLoaded', { detail: seedData });
    document.dispatchEvent(event);
}


async function loadSeedData() {

    try {

        let seedData = localStorage.getItem(seedDataKey);
        if (seedData) {
            dispatchSeedDataLoadedEvent(seedData);
            populateRolesList();
            return JSON.parse(seedData);
        }

        const response = await fetch('../assets/data/roles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        seedData = localStorage.setItem(seedDataKey, JSON.stringify(data));
        showToast("Base attribute weightings have been imported and saved.", 'Seed Data Success', 'success');
        dispatchSeedDataLoadedEvent(seedData);
            
        populateRolesList();
        return data;

    } catch (error) {
        showToast('There has been an error downloading the attribute weightings. Please try again.', "Error!", 'error');
        console.log(error);
    }
}

function calculateScores(tableData, seedData) {
    const startTime = Date.now();
    let errorOccurred = false;
    let errorMessage = '';

    const playerScores = tableData.map(player => {
        const scoresByRole = {};

        for (const role of seedData) {
            try {
                let totalScore = 0;
                let totalWeight = 0;

                for (const [attribute, weight] of Object.entries(role)) {
                    if (attribute === 'Role' || attribute === 'RoleCode') {
                        continue;
                    }

                    if (!player.hasOwnProperty(attribute)) {
                        throw new Error(`Missing attribute '${attribute}' in player data`);
                    }

                    let playerAttribute = processAttribute(player[attribute] || '0');

                    totalScore += playerAttribute * weight;
                    totalWeight += weight;
                }

                if (totalWeight > 0) {
                    const score = totalScore / totalWeight;
                    scoresByRole[role.RoleCode] = score.toFixed(1);
                }
            } catch (error) {
                errorOccurred = true;
                errorMessage = `Error calculating score for ${player.Name}: ${error.message}. Please make sure your game is set to the English language and the view is set to 'all attributes'. It will error if not.`;
                break;
            }
        }

        return { ...player, ...scoresByRole };
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    return { playerScores, timeTaken, errorOccurred, errorMessage };
}




function findHighestScoringRoles(playerScores, seedData) {
    return playerScores.map(player => {
        let highestScore = -Infinity;
        let highestScoringRole = '';
        let highestScoringRoleCode = ''; // Declare this variable inside the map function

        seedData.forEach(role => {
            const roleCode = role.RoleCode;
            const roleScore = parseFloat(player[roleCode]);
            if (!isNaN(roleScore) && roleScore > highestScore) {
                highestScore = roleScore;
                highestScoringRole = role.Role;
                highestScoringRoleCode = roleCode; // Correctly assign the roleCode
            }
        });

        return {
            ...player,
            HighestScoringRole: highestScoringRole,
            HighestScoringRoleCode: highestScoringRoleCode,
            HighestScore: highestScore
        };
    });
}




function loadLocalData() {
    let seedData = localStorage.getItem(seedDataKey);
    if (seedData) {
        seedData = JSON.parse(seedData);
        return seedData;
    }
}

function reloadSeedData() {
    localStorage.removeItem(seedDataKey);
    loadSeedData();
    clearSelectedRoles();


}

function getRoleDataByCode(roleCode) {
    var seedData = JSON.parse(localStorage.getItem('seedData')) || [];
    return seedData.find(role => role.RoleCode === roleCode);
}

function assignResetButton(){
    $('#restoreDefaults').on('click', function() {
        const reloadedData = reloadSeedData();
    });
}


