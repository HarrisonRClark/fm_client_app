function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

async function processFile(file) {
    try {
        showSpinner(); // Show spinner at the start

        const content = await readFile(file);
        const table = await validateHtmlContent(content);

        if (table) {
            const tableData = convertTableToObject(table);
            const scores = calculateScores(tableData, loadLocalData());



            if (scores && !scores.errorOccurred) {
                const numberOfPlayers = scores.playerScores.length;
                const formattedNumberOfPlayers = numberOfPlayers.toLocaleString();
                const timeTakenMs = scores.timeTaken;

                const playersWithHighestRoles = findHighestScoringRoles(scores.playerScores, loadLocalData());
                showToast(`Calculated all scores for ${formattedNumberOfPlayers} players in ${timeTakenMs} ms`, 'Calculation Complete', 'success');

                
                const playersWithUtilityScores = calculateUtilityScores(playersWithHighestRoles);

                initializeBootstrapTable(playersWithUtilityScores);
            } else if (scores.errorOccurred) {
                showToast(scores.errorMessage, 'Calculation Error', 'error');
            }
        }
    } catch (error) {
        showToast(error.message, 'File Read Error');
    } finally {
        hideSpinner();
    }
}


function calculateUtilityScores(data) {
    data.forEach(player => {
        let pac = processAttribute(player.Pac);
        let acc = processAttribute(player.Acc);
        let wor = processAttribute(player.Wor);
        let sta = processAttribute(player.Sta);
        let jum = processAttribute(player.Jum);
        let bra = processAttribute(player.Bra);

        player.Speed = (pac + acc) * 0.5;
        player.Workrate = (wor + sta) * 0.5;
        player.SetPieces = (jum + bra) * 0.5;
    });

    return data;
}


function processAttribute(attribute) {
    if (typeof attribute === 'string' && attribute.includes('-')) {
        if (attribute === '-') {
            return 0;
        }
        const rangeParts = attribute.split('-').map(part => parseInt(part, 10));
        if (rangeParts.length === 2 && rangeParts.every(part => !isNaN(part))) {
            return (rangeParts[0] + rangeParts[1]) / 2;
        }
        throw new Error(`Invalid range format for attribute '${attribute}'`);
    }
    return Number(attribute);
}


function validateHtmlContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');


    const table = hasValidTable(doc);
    if (!table) return;
    if (!hasValidRowCount(table)) return;


    // showToast("This is valid, good to proceed with calculations!", "Success", "success");

    return table;
}

function hasValidTable(doc) {
    const table = doc.querySelector('table');
    if (!table) {
        showToast('No valid table found in the file.', 'Validation Error');
        return false;
    }
    return table;
}

function hasValidRowCount(table) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 20000) {
        showToast('The table has more than 20,000 rows.', 'Validation Error');
        return false;
    }
    return true;
}


function convertTableToObject(table) {
    let result = [];
    let headers = [];

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(header => headers.push(header.textContent.trim()));

    const rows = Array.from(table.querySelectorAll('tr'));

    // Determine which 'Nat' column should be 'Nationality'
    if (headers.includes('Nat')) {
        let natIndexes = headers.reduce((indices, header, index) => {
            if (header === 'Nat') indices.push(index);
            return indices;
        }, []);

        natIndexes.forEach(natIndex => {
            // Check a few rows to ensure consistency
            for (let i = 1; i < Math.min(rows.length, 5); i++) {
                let sampleCellContent = rows[i].querySelectorAll('td')[natIndex].textContent.trim();
                // If the content matches exactly three letters, rename the column
                if (/^[A-Za-z]{3}$/.test(sampleCellContent)) {
                    headers[natIndex] = 'Nationality';
                    break;
                }
            }
        });
    }

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip the header row
        let rowData = {};
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            let header = headers[cellIndex];
            rowData[header] = cell.textContent.trim();
        });
        result.push(rowData);
    });

    return result;
}
