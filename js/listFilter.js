function populateRolesList() {

    let seedData = JSON.parse(localStorage.getItem(seedDataKey));
    const list = document.getElementById('roleList');
    list.innerHTML = '';

    seedData.forEach(role => {
        const listItem = document.createElement('li');
        listItem.className = 'dropdown-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
        <div class="d-flex align-items-center justify-content-between py-1">
        <div class="d-flex align-items-center">
            <button class="edit-role btn btn-sm me-2" data-rolecode="${role.RoleCode}" data-bs-toggle="modal" data-bs-target="#Modal">
                <i class="bi bi-sliders2 text-secondary"></i>
            </button>
            <label class="form-check-label filter-item me-2" for="role-${role.RoleCode}">
                ${role.Role}
            </label>
            <code>${role.RoleCode}</code>
        </div>
        </div>
        <i class="text-success bi bi-check-circle icon-check" style="display: none;"></i>
        `;
        document.getElementById('roleList').appendChild(listItem);
    });
    roleFilterEventListener();
}

function roleFilterEventListener() {
    $('#filterInput').on('input', function () {
        var searchValue = $(this).val().toLowerCase();
        updateFilter(searchValue);
    });
}

function handleSelection() {
    $('#roleList').on('click', 'li', function (event) {
        event.stopPropagation();

        var icon = $(this).find('.icon-check');
        icon.toggle();


        if (!$(event.target).closest('.edit-role').length) {
            var checkbox = $(this).find('.form-check-input');
            checkbox.prop('checked', !checkbox.prop('checked'));
        }
    });
}




function updateFilter(searchValue) {
    $(".filter-item").each(function () {
        var text = $(this).text().toLowerCase();
        var parentLi = $(this).parents('li.list-group-item');
        console.log(parentLi.prop('outerHTML')); // Log the outer HTML

        if (text.indexOf(searchValue) === -1) {
            parentLi.removeClass('d-flex').hide();
        } else {
            parentLi.addClass('d-flex').show();
        }
    });
}