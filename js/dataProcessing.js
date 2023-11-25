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
        showToast('There has been an error downloading the attribute weightings. Please try again.', "Error!" , 'error');
    }
}

function calculateScores(tableData, seedData) {
    const playerScores = [];
    const startTime = Date.now();

    tableData.forEach(player => {
        seedData.forEach(role => {
            try {
                let totalScore = 0;
                let totalWeight = 0;

                for (const [attribute, weight] of Object.entries(role)) {
                    if (attribute == 'Role' || attribute == 'RoleCode') {
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
                    playerScores.push({
                        playerName: player.Name,
                        roleCode: role.RoleCode,
                        roleName: role.Role,
                        score: score
                    });
                }

                

            } catch (error) {
                console.error(`Error calculating score for ${player.Name}: ${error.message}`);
            }
        });
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    return { playerScores, timeTaken };;
}





function loadLocalData() {
    let seedData = localStorage.getItem(seedDataKey);
    if (seedData) {
        seedData = JSON.parse(seedData);
        return seedData;
    }
}


loadSeedData();