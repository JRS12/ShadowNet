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


setInterval(fetchKeystrokeLogs, 3000);

window.onload = () => {
    fetchKeystrokeLogs();
};

function fetchControlStatus() {
    fetch('/control/get_control_status')
      .then(response => response.json())
      .then(data => {
        const indicator = document.getElementById("attackIndicator");
        if (!indicator) return;
  
        const status = data.status || "SAFE";
        indicator.textContent = status === "UNDER ATTACK" ? "⚠️ UNDER ATTACK" : "✅ SAFE";
        indicator.style.color = status === "UNDER ATTACK" ? "red" : "green";
      })
      .catch(error => console.error("Error fetching control status:", error));
  }
  
  setInterval(fetchControlStatus, 1000);
  window.onload = fetchControlStatus;
  