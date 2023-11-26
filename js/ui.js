$(document).ready(function() {
    console.log("Dom loaded");

    loadSeedData();
    handleSelection();
    updateUIFromStoredSelection();
    updateSelectedRolesSummary();
    roleFilterEventListener();
    assignClearButton();
    editInit();
    setupFileChangeListener();
    setupCalculateButtonListener();
    toggleThemeListener();




});