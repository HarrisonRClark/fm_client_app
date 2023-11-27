function editInit() {
    $('#roleList').on('click', '.edit-role', function() {
        var roleCode = $(this).data('rolecode');
        var roleData = getRoleDataByCode(roleCode); 
    
        $('#roleListModal').modal('hide');
    
        $('#roleListModal').on('hidden.bs.modal', function() {
    
            var $editForm = generateEditForm(roleData);
            $('#editRoleModal').find('.modal-body').empty().append($editForm);
    
            $('#editRoleModal').modal('show');  
            $('#roleListModal').off('hidden.bs.modal');
        });
    });
    

    $('#saveRoleChanges').click(function () {
        var updatedRoleData = {};
        $('#editRoleForm').find('input').each(function () {
            var inputName = $(this).attr('name');
            var inputValue = $(this).val();
            updatedRoleData[inputName] = $(this).attr('type') === 'number' ? parseFloat(inputValue) : inputValue;
        });

        updateRoleData(updatedRoleData);

        $('#editRoleModal').modal('hide');
        populateRolesList();
    });
}

function generateEditForm(roleData) {
    var $form = $('<form id="editRoleForm" class="container-fluid"></form>');
    var $currentRow = $('<div class="row"></div>');
    var index = 0;

    // Loop through each property in the role object
    for (var key in roleData) {
        if (roleData.hasOwnProperty(key)) {
            // Create a new row every 3 items
            if (index % 4 === 0) {
                $currentRow = $('<div class="row"></div>');
                $form.append($currentRow);
            }

            // Create form group for each property
            var $col = $('<div class="col-md-3"></div>'); // Each column takes up 4/12 of the row
            var $formGroup = $('<div class="mb-3"></div>');
            var $label = $(`<label class="form-label">${key}</label>`);

            var inputType = (key === 'Role' || key === 'RoleCode') ? 'text' : 'number';
            var $input = $(`<input type="${inputType}" class="form-control" id="${key}" name="${key}" value="${roleData[key]}" autocomplete="off">`);
            if (key === 'Role' || key === 'RoleCode') {
                $input.prop('disabled', true);
            }

            // Append label and input to form group, then to column
            $formGroup.append($label, $input);
            $col.append($formGroup);

            // Append the column to the current row
            $currentRow.append($col);

            index++;
        }
    }

    return $form;
}


function updateRoleData(updatedRoleData) {
    var seedData = JSON.parse(localStorage.getItem('seedData')) || [];
    var roleIndex = seedData.findIndex(role => role.RoleCode === updatedRoleData.RoleCode); // Change here

    if (roleIndex !== -1) {
        seedData[roleIndex] = updatedRoleData;
    } else {
        showToast("Role not found!", "Error");
    }
    
    localStorage.setItem('seedData', JSON.stringify(seedData));
    showToast(`Updated attribute weightings for ${updatedRoleData.Role}.`, "Updated", "success");
}

