document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('date');
    const currentDate = new Date().toLocaleDateString(undefined, {
        month: 'long'
    });
    dateElement.textContent = currentDate;

    // Initialize the pie chart (unchanged)
    const data = {
        labels: ['Savings', 'Housing', 'Food', 'Transportation', 'Lifestyle', 'Education', 'Insurance', 'Debt', 'Donations', 'Miscellaneous'],
        datasets: [{
            label: 'Expenses',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Placeholder data
            backgroundColor: [
                'rgba(136, 14, 114, 0.5)',
                'rgba(13, 158, 255, 0.5)',
                'rgba(25, 135, 84, 0.5)',
                'rgba(220, 53, 69, 0.5)',
                'rgba(225, 205, 7, 0.5)',
                'rgba(111, 66, 205, 0.5)',
                'rgba(193, 66, 180, 0.5)',
                'rgba(13, 206, 244, 0.5)',
                'rgba(0, 0, 0, 0.5)'
            ],
            borderColor: [
                'rgba(136, 14, 114, 1)',
                'rgba(13, 158, 255, 1)',
                'rgba(25, 135, 84, 1)',
                'rgba(220, 53, 69, 1)',
                'rgba(225, 205, 7, 1)',
                'rgba(111, 66, 205, 1)',
                'rgba(193, 66, 180, 1)',
                'rgba(13, 206, 244, 1)',
                'rgba(0, 0, 0, 1)'
            ],
            borderWidth: 1.5
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + ' CAD';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('expensesPieChart').getContext('2d');
    const chart = new Chart(ctx, config);

    loadSavedData();

    // Handle form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            saveFormData(form);
            addNewInputField(form); // Add a new input field after saving
            toggleEditable(form, false); // Make saved inputs uneditable
        });
    });

    // Handle clear data button click
    document.getElementById('clearDataButton').addEventListener('click', function() {
        clearAllData();
    });

    // Handle edit button click
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            event.preventDefault();
            const form = event.target.closest('form');
            toggleEditable(form, true); // Make all inputs editable again
        }
    });

    // Handle delete button click
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const inputRow = event.target.closest('.input-row');
            const form = inputRow.closest('form');
            inputRow.remove(); // Remove the input row
            updateTableCell(form); // Update the table cell for this form section
            updateChart(); // Update the chart to reflect changes
        }
    });

    function loadSavedData() {
        document.querySelectorAll('input').forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue) {
                input.value = savedValue;
            }
        });
        updateAllTableCells(); // Update all table cells after loading data
        updateChart(); // Update the chart with loaded data
    }

    function saveFormData(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value) {
                localStorage.setItem(input.id, input.value);
                input.setAttribute('readonly', 'true'); // Make saved inputs uneditable
                input.classList.add('editable'); // Add a class to indicate it’s not editable
            }
        });
        updateTableCell(form); // Update the table cell for this form section
        updateChart(); // Chart updates once data is saved
    }

    function updateAllTableCells() {
        document.querySelectorAll('form').forEach(form => {
            updateTableCell(form);
        });
    }

    function updateTableCell(form) {
        const inputs = form.querySelectorAll('input[type="number"]');
        let sum = 0;

        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });

        const formId = form.querySelector('input[type="number"]').id.replace('InputField2', 'Form');
        const row = document.querySelector(`tr[data-form="${formId}"]`);
        if (row) {
            const cell = row.querySelector('td.planned');
            if (cell) {
                cell.textContent = Math.round(sum); // Display the sum as a whole number in the table
            }
        }
    }

    function updateChart() {
        const categories = ['Savings', 'Housing', 'Transportation', 'Food', 'Lifestyle', 'Education', 'Insurance', 'Debt', 'Donations', 'Miscellaneous'];
        const chartData = categories.map(category => {
            const row = document.querySelector(`tr[data-form="${category.toLowerCase()}Form"]`);
            const plannedCell = row ? row.querySelector('td.planned') : null;
            return plannedCell ? parseFloat(plannedCell.textContent) || 0 : 0;
        });

        chart.data.datasets[0].data = chartData;
        chart.update();
    }

    function toggleEditable(form, editable) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (editable) {
                input.removeAttribute('readonly');
                input.classList.remove('editable');
            } else {
                if (input.value) { // Only make inputs uneditable if they have a value
                    input.setAttribute('readonly', 'true');
                    input.classList.add('editable');
                }
            }
        });
    }

    function addNewInputField(form) {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group', 'd-flex', 'flex-direction-column', 'justify-content-around', 'input-row');

        const newInputName = document.createElement('input');
        newInputName.type = 'text';
        newInputName.className = 'form-control border-0 m-2';
        newInputName.placeholder = 'Enter new item';
        newInputName.required = true;

        const newInputAmount = document.createElement('input');
        newInputAmount.type = 'number';
        newInputAmount.className = 'form-control border-0 m-2';
        newInputAmount.placeholder = 'Enter amount';
        newInputAmount.required = true;

        // New inputs are initially editable
        newInputName.removeAttribute('readonly');
        newInputAmount.removeAttribute('readonly');
        newInputName.classList.remove('editable');
        newInputAmount.classList.remove('editable');

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'border-0 bg-transparent delete-button';
        deleteButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

        formGroup.appendChild(newInputName);
        formGroup.appendChild(newInputAmount);
        formGroup.appendChild(deleteButton);

        form.insertBefore(formGroup, form.querySelector('.button-container'));
    }

    function clearAllData() {
        localStorage.clear();

        document.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.removeAttribute('readonly'); // Make sure inputs are editable after clearing data
            input.classList.remove('editable');
        });

        // Clear the table cells
        document.querySelectorAll('table td.planned').forEach(cell => {
            cell.textContent = '';
        });

        // Clear the chart
        updateChart();

        location.reload();
    }
});
