//////////////////////// Pie Chart ////////////////////////
document.addEventListener('DOMContentLoaded', (event) => {
    const data = {
        labels: ['Housing', 'Transportation', 'Food', 'Lifestyle', 'Education', 'Insurance', 'Debt', 'Donations', 'Miscellaneous'],
        datasets: [{
            label: 'Expenses',
            // need to change data based on user input
            data: [1200, 300, 150, 100, 200],
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

    // This is the configuration of the chart
    const config = {
        type: 'doughnut',
        // This is the data defined above
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    // You can remove this
                    display: false,
                    position: 'top',
                },
                // This is the configuration for the tooltip
                // It will display the value of the data
                tooltip: {
                    // this function will format the tooltip
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

    // This is the context of the canvas element
    // This is where the chart will be drawn
    const ctx = document.getElementById('expensesPieChart').getContext('2d');
    // This creates the chart
    new Chart(ctx, config);
});


//////////////////////// Date ////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    const dateElement = document.getElementById('date');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
    });
    dateElement.textContent = formattedDate;
});

