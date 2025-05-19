const form = document.getElementById('attendanceForm');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    loadingDiv.style.display = 'block';
    messageDiv.style.display = 'none';

    const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        status: form.status.value,
        location: form.location.value,
        remarks: form.remarks.value.trim(),
    };

    try {
        const response = await fetch('https://attendance-clk6.onrender.com/mark-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Attendance marked successfully!';
            form.reset();
        } else {
            const errData = await response.json();
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Error: ' + (errData.error || 'Failed to mark attendance');
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Network error. Please try again.';
    } finally {
        // Re-enable button and hide loading
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Attendance';
        loadingDiv.style.display = 'none';
        messageDiv.style.display = 'block';

        // Auto-hide message
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
        }, 3000);
    }
});
