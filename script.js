const form = document.getElementById('attendanceForm');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');
const submitButton = form.querySelector('button[type="submit"]');
const addressField = document.getElementById('fullAddress');
const locationStatus = document.getElementById('locationStatus');
const getLocationBtn = document.getElementById('getLocationBtn');

// 📍 Function to get location and reverse geocode it
async function fetchLocation() {
    if ("geolocation" in navigator) {
        locationStatus.textContent = "Fetching location...";
        locationStatus.style.color = "blue";

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                    const data = await res.json();
                    const address = data.display_name;
                    addressField.value = address;
                    locationStatus.textContent = "📍 Location fetched successfully ✅";
                    locationStatus.style.color = "green";
                } catch (error) {
                    addressField.value = `Lat: ${lat}, Lon: ${lon}`;
                    locationStatus.textContent = "⚠️ Could not get full address. Using coordinates.";
                    locationStatus.style.color = "orange";
                }
            },
            (err) => {
                addressField.value = "";
                locationStatus.textContent = "❌ Location permission denied. Please allow location access.";
                locationStatus.style.color = "red";
            }
        );
    } else {
        locationStatus.textContent = "❌ Geolocation not supported by your browser.";
        locationStatus.style.color = "red";
    }
}

// 🔘 Manual trigger: fetch location on button click
getLocationBtn.addEventListener('click', fetchLocation);

// 📤 Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!addressField.value) {
        alert("📍 Please fetch your location before submitting the form.");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    loadingDiv.style.display = 'block';
    messageDiv.style.display = 'none';

    const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        status: form.status.value,
        location: form.location.value + " (" + addressField.value + ")",
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
            messageDiv.textContent = '✅ Attendance marked successfully!';
            form.reset();
            addressField.value = '';
            locationStatus.textContent = 'Location not fetched yet.';
            locationStatus.style.color = 'blue';
        } else {
            const errData = await response.json();
            messageDiv.style.color = 'red';
            messageDiv.textContent = '❌ Error: ' + (errData.error || 'Failed to mark attendance');
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = '❌ Network error. Please try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Attendance';
        loadingDiv.style.display = 'none';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
        }, 3000);
    }
});
