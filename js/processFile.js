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
        const content = await readFile(file);
        validateHtmlContent(content);
    } catch (error) {
        showToast(error.message, 'File Read Error');
    }
}

function validateHtmlContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');


    const table = hasValidTable(doc);
    if (!table) return;
    if (!hasValidRowCount(table)) return;

    showToast("This is valid, good to proceed with calculations!", "Success", "success");
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
    if (rows.length > 2000) {
        showToast('The table has more than 2000 rows.', 'Validation Error');
        return false;
    }
    return true;
}