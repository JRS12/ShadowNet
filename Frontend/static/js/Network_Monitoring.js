console.log("Network_Monitoring.js loaded");

function fetchNetworkLogs() {
  fetch('/network_monitoring/get_network_logs')
    .then(response => {
      if (!response.ok) {
        console.error("Failed to fetch logs. Status:", response.status);
        return [];
      }
      return response.json();
    })
    .then(data => {
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = ""; 

      data.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry.ip}</td>
          <td>${entry.username}</td>
          <td>${entry.timestamp}</td>
          <td>${entry.message}</td>
          <td>${entry.protocol}</td>
          <td>${entry.port}</td>
          <td>${entry.status}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error loading network logs:", error);
    });
}

function fetchControlStatus() {
  fetch('/network_monitoring/control_status.json')
    .then(response => response.json())
    .then(data => {
      const indicator = document.getElementById("attack-indicator");
      if (indicator) {
        indicator.textContent = data.status === "UNDER_ATTACK" ? "⚠️ UNDER ATTACK" : "✅ SAFE";
        indicator.style.color = data.status === "UNDER_ATTACK" ? "red" : "green";
      }
    });
}

fetchNetworkLogs();
fetchControlStatus();

setInterval(fetchNetworkLogs, 3000);      
setInterval(fetchControlStatus, 1000);    