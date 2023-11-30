function initializeBootstrapTable(data) {



    var useWageTitle = data.some(item => item.Wage !== undefined);

    // Define static columns
    var columns = [
        { field: 'Name', title: 'Name', sortable: true },
        { field: 'Inf', title: 'Inf', sortable: true },
        { field: 'Age', title: 'Age', sortable: true },
        { field: 'Club', title: 'Club', sortable: true},
        { field: 'Transfer Value', title: 'Transfer Value', sortable: true },
        {
            field: 'Wage',
            title: useWageTitle ? 'Wage' : 'Salary',
            sortable: true,
            formatter: function (value, row) {
                return row.Wage || row.Salary;
            }
        },
        { field: 'Nationality', title: 'Nationality', sortable: true },
        { field: 'Position', title: 'Position', sortable: true },
        { field: 'Personality', title: 'Personality', sortable: true },
        { field: 'Media Handling', title: 'Media Handling', sortable: true },
        { field: 'Left Foot', title: 'Left Foot', sortable: true },
        { field: 'Right Foot', title: 'Right Foot', sortable: true },
        { field: 'Speed', title: 'Speed', sortable: true },
        { field: 'Jum', title: 'Jump', sortable: true },
        { field: 'Str', title: 'Strength', sortable: true },
        { field: 'Workrate', title: 'Workrate', sortable: true },
        { field: 'Height', title: 'Height', sortable: true },


    ];

    // Retrieve selectedRoles from localStorage and append as dynamic columns
    var selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
    selectedRoles.forEach(function (role) {
        columns.push({ field: role.code, title: role.code, sortable: true, titleTooltip: role.name });
    });

    columns.push(
        { field: 'HighestScoringRole', title: 'Best Role', sortable: true },
        { field: 'HighestScore', title: 'Best Role Score', sortable: true });

    var $table = $('#playersTable')

    if ($table.bootstrapTable('getData').length > 0 || $table.data('bootstrap.table')) {
        $table.bootstrapTable('destroy');
    }

    $table.bootstrapTable({
        data: data,
        columns: columns
    });

    $(function () {
        $('#toolbar').find('select').change(function () {
            $table.bootstrapTable('destroy').bootstrapTable({
                exportDataType: $(this).val(),
                exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
                columns: columns,
                data: data
            })
        }).trigger('change')
    })
}