document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
        const form = document.getElementById('contact-form');
        const data = new FormData(form);
        
        fetch(scriptURL, { method: 'POST', body: data })
            .then(response => response.text())
            .then(result => {
                document.getElementById('message-alert').innerText = 'Details sent successfully!';
                document.getElementById('message-alert').style.display = 'block';
                setTimeout(() => { document.getElementById('message-alert').style.display = 'none'; }, 3000);
                form.reset();
            })
            .catch(error => console.error('Error!', error.message));
    });
});

function initMap() {
    const companyLocation = { lat: 23.0225, lng: 72.5714 }; // Example: Ahmedabad, Gujarat, India
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: companyLocation,
    });
    const marker = new google.maps.Marker({
        position: companyLocation,
        map: map,
    });
}
