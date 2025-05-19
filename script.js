 const form = document.getElementById('attendanceForm');
        const messageDiv = document.getElementById('message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                status: form.status.value,
                remarks: form.remarks.value.trim(),
            };

            try {
                const response = await fetch('http://213.210.36.19:5050/mark-attendance', {
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
                    // Hide message after 3 seconds
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                        messageDiv.textContent = '';
                    }, 3000);

                } else {
                    const errData = await response.json();
                    messageDiv.style.color = 'red';
                    messageDiv.textContent = 'Error: ' + (errData.error || 'Failed to mark attendance');
                }
            } catch (error) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Network error. Please try again.';
            }
        });