// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the output screen
    const output = document.getElementById('output');
    
    // Get all buttons
    const buttons = document.querySelectorAll('button');
    
    // Add click event listener to each button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value === '=') {
                // Send expression to Flask for calculation
                calculateWithFlask(output.value);
            } else if (value === 'Clear') {
                // Clear the entire screen
                output.value = '';
            } else if (value === 'AC') {
                // AC does backspace (remove last character)
                output.value = output.value.slice(0, -1);
            } else {
                // Add the number or operator to the display
                if (output.value === 'Error') {
                    output.value = ''; // Clear error before adding new input
                }
                output.value += value;
            }
        });
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Handle number keys and operators
        if ('0123456789+-*/.'.includes(key)) {
            if (output.value === 'Error') {
                output.value = '';
            }
            output.value += key;
        }
        
        // Handle Enter key as equals
        if (key === 'Enter') {
            calculateWithFlask(output.value);
        }
        
        // Handle Backspace
        if (key === 'Backspace') {
            output.value = output.value.slice(0, -1);
        }
        
        // Handle Escape to clear
        if (key === 'Escape') {
            output.value = '';
        }
    });
    
    // Function to send calculation to Flask
    function calculateWithFlask(expression) {
        if (!expression.trim()) return;
        
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression: expression })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result !== undefined) {
                output.value = data.result;
            } else if (data.error) {
                output.value = 'Error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            output.value = 'Error';
        });
    }
});