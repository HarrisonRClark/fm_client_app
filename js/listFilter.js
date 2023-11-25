function populateRolesList() {

    let seedData = JSON.parse(localStorage.getItem(seedDataKey));
    const list = document.getElementById('roleList');
    list.innerHTML = '';

    seedData.forEach(role => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div class="form-check py-1">
            <button class="edit-role btn btn-sm" data-rolecode="${role.RoleCode}">
                <i class="bi bi-sliders2"></i>
            </button>
                <input class="form-check-input" type="checkbox" value="${role.RoleCode}" id="role-${role.RoleCode}">
                <label class="form-check-label" for="role-${role.RoleCode}">
                ${role.Role}
                </label>
                <code>${role.RoleCode}</code>
            </div>
        `;
        list.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    populateRolesList();

    document.getElementById('roleList').addEventListener('click', function(event) {
        if (event.target.matches('.edit-role, .edit-role *')) {
            const roleCode = event.target.closest('.edit-role').getAttribute('data-rolecode');
            console.log('Edit button clicked for role code:', roleCode);
        }
    });
});

