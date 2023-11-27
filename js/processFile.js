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
                console.log(playersWithHighestRoles);

                initializeBootstrapTable(playersWithHighestRoles);
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
    headerCells.forEach(header => {
        headers.push(header.textContent.trim());
    });

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
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
