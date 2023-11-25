const seedDataKey = 'seedData';

async function loadSeedData() {

    try {

        let seedData = localStorage.getItem(seedDataKey);
        if (seedData) {
            return JSON.parse(seedData);
        }

        const response = await fetch('../assets/data/roles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        localStorage.setItem(seedDataKey, JSON.stringify(data));
        showToast("Base attribute weightings have been imported and saved.", 'Seed Data Success', 'success');

        return data;
    } catch (error) {
        showToast('There has been an error downloading the attribute weightings. Please try again.', "Error!", 'error');
    }
}
function calculateScores(tableData, seedData) {
    const startTime = Date.now();
    const playerScores = tableData.map(player => {

        const scoresByRole = {};

        seedData.forEach(role => {
            try {
                let totalScore = 0;
                let totalWeight = 0;

                for (const [attribute, weight] of Object.entries(role)) {
                    if (attribute === 'Role' || attribute === 'RoleCode') {
                        continue;
                    }

                    if (!player.hasOwnProperty(attribute)) {
                        throw new Error(`Missing attribute '${attribute}' in player data.`);
                    }

                    const playerAttribute = parseInt(player[attribute] || '0', 10);
                    totalScore += playerAttribute * weight;
                    totalWeight += weight;
                }

                if (totalWeight > 0) {
                    const score = totalScore / totalWeight;
                    scoresByRole[role.RoleCode] = score;
                }
            } catch (error) {
                hideSpinner();
                showToast(`Error calculating score for ${player.Name}: ${error.message}`, "Error!");
                console.error(`Error calculating score for ${player.Name}: ${error.message}`);
                scoresByRole[role.RoleCode] = 'Error'; // Indicate error for this role
                
            }
        });

        return { ...player, ...scoresByRole };
    });

    hideSpinner();
    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    return { playerScores, timeTaken };
}


function findHighestScoringRoles(playerScores, seedData) {
    return playerScores.map(player => {
        let highestScore = -Infinity;
        let highestScoringRole = '';

        seedData.forEach(role => {
            const roleCode = role.RoleCode;
            if (player[roleCode] && player[roleCode] > highestScore) {
                highestScore = player[roleCode];
                highestScoringRole = role.Role;
                highestScoringRoleCode = role.RoleCode;
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


loadSeedData();


