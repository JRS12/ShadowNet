console.log("Keystroke_Monitoring.js loaded");

function fetchKeystrokeLogs() {
    fetch('/keystroke/get_keystroke_logs')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = "";

            data.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.username}</td>
                    <td>${entry.ip_address}</td>
                    <td>${entry.date}</td>
                    <td>${entry.time}</td>
                    <td>${entry.keystroke}</td>
                    <td>${entry.attack_type || 'None'}</td>
                `;
                tbody.appendChild(row);
            });
        });
}

function fetchControlStatus() {
    fetch('/keystroke/control_status.json')
        .then(response => response.json())
        .then(data => {
            const statusElem = document.getElementById("keystrokeStatus");
            if (data.status === "UNDER ATTACK") {
                statusElem.textContent = "UNDER ATTACK";
                statusElem.style.color = "red";
            } else {
                statusElem.textContent = "Safe";
                statusElem.style.color = "green";
            }
        });
}

setInterval(fetchKeystrokeLogs, 3000);
setInterval(fetchControlStatus, 1000);

window.onload = () => {
    fetchKeystrokeLogs();
    fetchControlStatus();
};
