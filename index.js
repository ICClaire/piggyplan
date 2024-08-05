document.addEventListener('DOMContentLoaded', () => {
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
            event.preventDefault(); // Prevent the form from submitting and reloading the page
            saveFormData(form);
            toggleEditable(form); // Close the editing mode after saving
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
            toggleEditable(form);
        }
    });

    function loadSavedData() {
        document.querySelectorAll('input').forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue) {
                input.value = savedValue;
                updateTableCell(input);
            }
        });
        updateChart();
    }

    function saveFormData(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value) {
                localStorage.setItem(input.id, input.value);
                updateTableCell(input);
            }
        });
        updateChart(); // Chart updates once data is saved
    }

    //udating table input when data saved
    function updateTableCell(input) {
        const formId = input.id.replace('InputField2', 'Form');
        const row = document.querySelector(`tr[data-form="${formId}"]`);
        if (row) {
            const cell = row.querySelector('td.planned');
            if (cell) {
                cell.textContent = input.value;
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

    function toggleEditable(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.hasAttribute('readonly')) {
                input.removeAttribute('readonly');
                input.classList.remove('editable');
            } else {
                input.setAttribute('readonly', 'true');
                input.classList.add('editable');
            }
        });
    }

    function clearAllData() {
        localStorage.clear();

        document.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.removeAttribute('readonly');
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