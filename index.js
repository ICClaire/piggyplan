document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the pie chart
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
                                label += context.parsed + 'CAD';
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
        });
    });

    // Handle clear data button click
    document.getElementById('clearDataButton').addEventListener('click', function() {
        clearAllData();
    });
});

function loadSavedData() {
    document.querySelectorAll('input').forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) {
            // Replace the input field with the saved value
            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = savedValue;
            valueDisplay.classList.add('saved-value');

            input.replaceWith(valueDisplay);
        }
    });
}

function saveFormData(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        const value = input.value;
        if (value) {
            localStorage.setItem(input.id, value);

            // Replace the input field with the saved value
            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = value;
            valueDisplay.classList.add('saved-value');

            input.replaceWith(valueDisplay);
        }
    });
}

function replaceWithInput(inputId, currentValue) {
    // Create a new input element
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = inputId;
    newInput.value = currentValue;

    // Add a listener to handle form submission again
    newInput.addEventListener('change', function() {
        localStorage.setItem(inputId, newInput.value);
        loadSavedData(); // Refresh the display with the updated value
    });

    // Replace the saved value display with the new input field
    const valueDisplay = document.getElementById(inputId).nextElementSibling.previousElementSibling;
    valueDisplay.replaceWith(newInput);
    newInput.focus();
}

function clearAllData() {
    // Remove all items from localStorage
    localStorage.clear();

    // Remove all displayed saved values
    document.querySelectorAll('.saved-value').forEach(element => {
        const inputId = element.textContent; // Get the text content to determine the input ID
        if (inputId) {
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.id = inputId;
            newInput.value = '';
            newInput.classList.add('form-control', 'border-0', 'm-2');
            newInput.placeholder = 'Enter Amount';

            // Replace the display element with the new input field
            element.replaceWith(newInput);
        }
    });

    // Reload the page to reset the chart and other elements
    location.reload();
}