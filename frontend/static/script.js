let isTyping = false; // Track if typing is in progress

// Update the displayed delay value when the slider changes
const delaySlider = document.getElementById('delay');
const delayValueDisplay = document.getElementById('delayValue');

delaySlider.addEventListener('input', function () {
    delayValueDisplay.innerText = this.value; // Update the displayed value
});

// Update the displayed typing speed value when the slider changes
const speedSlider = document.getElementById('speed');
const speedValueDisplay = document.getElementById('speedValue');

speedSlider.addEventListener('input', function () {
    speedValueDisplay.innerText = this.value; // Update the displayed value
});

// Helper function to update the UI state
function updateUIState(startDisabled, stopDisabled, message, messageClass) {
    document.querySelector('button[onclick="startTyping()"]').disabled = startDisabled;
    document.getElementById('stopButton').disabled = stopDisabled;
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    messageDiv.classList.remove('success', 'error');
    if (messageClass) messageDiv.classList.add(messageClass);
}

// Helper function to clear input fields
function clearInputFields() {
    document.getElementById('text').value = '';
}

async function startTyping() {
    if (isTyping) return; // Prevent multiple clicks

    const text = document.getElementById('text').value;
    const delay = delaySlider.value; // Get delay from slider
    const speed = speedSlider.value; // Get typing speed from slider

    console.log("Typing Speed:", speed); // Debugging: Log the speed value

    if (!text) {
        updateUIState(false, true, "Please enter some text!", 'error');
        return;
    }

    // Disable the start button and enable the stop button
    updateUIState(true, false, 'Typing in progress...', 'success');
    isTyping = true;

    try {
        const response = await fetch('/type', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, delay, speed }), // Ensure speed is included
        });

        const result = await response.json();
        if (result.status === 'success') {
            updateUIState(false, true, result.message, 'success');
        } else {
            updateUIState(false, true, result.message, 'error');
        }
    } catch (error) {
        updateUIState(false, true, "An error occurred. Please try again.", 'error');
    } finally {
        isTyping = false;
        clearInputFields(); // Clear input fields after completion or error
    }
}

async function stopTyping() {
    try {
        const response = await fetch('/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        updateUIState(false, true, result.message, 'error');
    } catch (error) {
        updateUIState(false, true, "An error occurred while stopping.", 'error');
    } finally {
        clearInputFields(); // Clear input fields when stopped
    }
}