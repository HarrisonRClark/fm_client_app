$(document).ready(function() {
    console.log("Dom loaded");

    loadSeedData();
    fileChangeListener();
    handleSelection();
    updateUIFromStoredSelection();
    updateSelectedRolesSummary();
    roleFilterEventListener();
    assignClearButton();


});