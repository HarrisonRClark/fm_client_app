var selectedRoles = [];
var allRoles = [];

function populateRolesList() {
    var seedData = JSON.parse(localStorage.getItem(seedDataKey));
    var $list = $('#roleList');
    $list.empty();

    $.each(seedData, function (index, role) {
        var $listItem = $('<li class="dropdown-item d-flex justify-content-between align-items-center"></li>');
        var listItemContent = `
            <div class="d-flex align-items-center justify-content-between fpy-1">
                <div class="d-flex align-items-center">
                    <div class="form-check-label filter-item me-2" id="${role.Role}">
                        ${role.Role}
                    </div>
                    <code id="${role.RoleCode}">${role.RoleCode}</code>
                </div>
            </div>
            <div>
                <i class="text-success bi bi-check-circle-fill icon-check" style="display: none;"></i>
                <button class="edit-role btn btn-sm me-2" data-rolecode="${role.RoleCode}" data-bs-target="#editRoleModal" data-bs-toggle="modal">
                    <i class="bi bi-sliders2 text-secondary"></i>
                </button>
            </div>
        `;
        $listItem.html(listItemContent);
        $list.append($listItem);
    });
}
function roleFilterEventListener() {
    $('#search-roles').on('input', function () {
        var searchValue = $(this).val().toLowerCase();
        updateFilter(searchValue);
    });

    $('#roleListModal').on('hidden.bs.modal', function () {
        $('#search-roles').val('');
        updateFilter('');
    });
}
function handleSelection() {
    $('#roleList').on('click', 'li', function (event) {
        var roleCode = $(this).find('code').attr('id');
        var role = $(this).find('.form-check-label').attr('id');
        var icon = $(this).find('.icon-check');

        // Check if the click is on the edit-role button or any of its children
        if ($(event.target).closest('.edit-role').length === 0) {
            icon.toggle(); // Toggle icon visibility only if not clicking on edit-role
            var isSelected = icon.is(':visible');

            if (!isSelected) {
                selectedRoles = selectedRoles.filter(function (r) {
                    return r.code !== roleCode;
                });
            } else {
                selectedRoles.push({ code: roleCode, name: role });
            }

            updateSelectedRolesSummary();
            storeSelection();
            updateUIFromStoredSelection();
        }
    });
}


function storeSelection() {
    localStorage.setItem('selectedRoles', JSON.stringify(selectedRoles));

}


function updateUIFromStoredSelection() {
    $('#roleList').find('.icon-check').hide();
    var storedSelection = localStorage.getItem('selectedRoles');
    if (storedSelection) {
        selectedRoles = JSON.parse(storedSelection);
        selectedRoles.forEach(function (role) {
            var listItem = $('#roleList').find(`code[id="${role.code}"]`).closest('li');
            listItem.find('.icon-check').show();
        });
    }
}

function updateFilter(searchValue) {
    $("#roleList .dropdown-item").each(function () {
        var text = $(this).text().toLowerCase();
        if (text.indexOf(searchValue) === -1) {
            $(this).addClass('d-none');
        } else {
            $(this).removeClass('d-none');
        }
    });
}



function updateSelectedRolesSummary() {
    var summaryContainer = $('.selected-roles');
    summaryContainer.empty();

    selectedRoles.forEach(function (role) {

        var pill = $('<button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-between mb-2 me-2"></button>');
        var roleInfo = $('<span class="me-2"></span>').text(role.name + ' (' + role.code + ')');

        // Remove role functionality
        pill.append(roleInfo).click(function () {
            selectedRoles = selectedRoles.filter(function (r) {
                return r.code !== role.code;
            });
            updateSelectedRolesSummary();
            storeSelection();
            updateUIFromStoredSelection();
        });

        summaryContainer.append(pill);
    });
}

function assignClearButton() {
    $('#clear-selected-roles').on('click', function () {
        clearSelectedRoles();
    });
}

function clearSelectedRoles() {
    selectedRoles = []
    updateSelectedRolesSummary();
    storeSelection();
    updateUIFromStoredSelection();
}

function selectAllRoles() {
    $('#roleList').find('code').each(function () {
        var roleCode = $(this).attr('id');
        var roleName = $(this).closest('li').find('.form-check-label').text();
        allRoles.push({ code: roleCode, name: roleName });
    });

    selectedRoles = allRoles.map(function (role, index) {
        return { code: role.code, name: role.name, order: index };
    });

    updateSelectedRolesSummary();
    storeSelection();
    updateUIFromStoredSelection();

}