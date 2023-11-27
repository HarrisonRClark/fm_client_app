function setupFileChangeListener(){
    var fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        if (!file) {
            showToast("No file selected!", "Error", "error");
            return;
        }

        showSpinner();
        setTimeout(() => {
            if (isValidFile(file)) {
                hideSpinner();
                showToast("Valid file!", "Success", "success");
            } else {
                resetFileInput(fileInput);
                hideSpinner();
            }
        }, 0);
    });
}


function setupCalculateButtonListener(){
    var fileInput = document.getElementById('file-input');
    var calculateButton = document.getElementById('calculateScoresButton');

    calculateButton.addEventListener('click', function () {
        var file = fileInput.files[0];
        if (!file) {
            showToast("No file selected!", "Error", "error");
            return;
        }

        showSpinner();
        setTimeout(() => {
            if (isValidFile(file)) {
                processFile(file);
                updateUIFromStoredSelection();
            } else {
                resetFileInput(fileInput);
                
                updateUIFromStoredSelection();
                hideSpinner();
            }
        }, 0);
    });
}

function isValidFile(file) {
    if (!file) {
        showToast('No file selected.', 'File Error');
        return false;
    }

    if (!isValidFileName(file.name)) {
        showToast('Invalid file name. The file name cannot be blank.', 'File Name Error');
        return false;
    }

    if (!isHtmlFileType(file)) {
        showToast('Invalid file type. Please select an HTML file.', 'File Type Error');
        return false;
    }

    return true;
}


function isValidFileName(fileName) {
    return fileName.trim() !== '';
}

function isHtmlFileType({ type, name }) {
    var fileType = type;
    var fileName = name;
    return fileType === 'text/html' || fileName.endsWith('.html');
}

function resetFileInput(fileInput) {
    fileInput.value = '';
}



// UI
function showSpinner() {
    $('#loadingSpinner').show();
}

function hideSpinner() {
    $('#loadingSpinner').hide();
}