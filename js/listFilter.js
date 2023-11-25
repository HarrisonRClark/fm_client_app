function populateRolesList() {

    let seedData = JSON.parse(localStorage.getItem(seedDataKey));
    const list = document.getElementById('roleList');
    list.innerHTML = '';

    seedData.forEach(role => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${role.RoleCode}" id="role-${role.RoleCode}">
                <label class="form-check-label" for="role-${role.RoleCode}">
                    ${role.Role}
                </label>
            </div>
            <button class="edit-role btn btn-outline-secondary btn-sm"><i class="bi bi-pencil-square"></i></button>
        `;
        list.appendChild(listItem);
    });
}


document.addEventListener('SeedDataLoaded', (e) => {
    const seedData = e.detail;
    populateRolesList();
});