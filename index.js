document.addEventListener('DOMContentLoaded', () => {
    // Initialize the pie chart (unchanged)
    const data = {
        labels: ['Housing', 'Transportation', 'Food', 'Lifestyle', 'Education', 'Insurance', 'Debt', 'Donations', 'Miscellaneous'],
        datasets: [{
            label: 'Expenses',
            data: [1200, 300, 150, 100, 200], // Placeholder data
            backgroundColor: [
                'rgba(0, 0, 255, 0.2)',
                'rgba(255, 0, 0, 0.2)',
                'rgba(0, 255, 0, 0.2)',
                'rgba(255, 255, 0, 0.2)',
                'rgba(128, 0, 128, 0.2)',
                'rgba(255, 192, 203, 0.2)',
                'rgba(135, 206, 235, 0.2)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(255, 0, 255, 0.2)'
            ],
            borderColor: [
                'rgba(0, 0, 255, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(128, 0, 128, 1)',
                'rgba(255, 192, 203, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(255, 0, 255, 1)'
            ],
            borderWidth: 1
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
    new Chart(ctx, config);

    // Load any saved data when the page is loaded
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
            event.preventDefault(); // Prevent the form from submitting and reloading the page
            const form = event.target.closest('form');
            toggleEditable(form);
        }
    });
});

function loadSavedData() {
    document.querySelectorAll('input').forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
            updateTableCell(input);
        }
    });
}

function saveFormData(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.value) {
            localStorage.setItem(input.id, input.value);
            updateTableCell(input);
        }
    });
}

function updateTableCell(input) {
    const formId = input.id.replace('InputField2', 'Form'); // Adjust ID matching based on your naming convention
    const row = document.querySelector(`tr[data-form="${formId}"]`);
    if (row) {
        const cell = row.querySelector('td.planned');
        if (cell) {
            cell.textContent = input.value;
        }
    }
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

    location.reload();
}
