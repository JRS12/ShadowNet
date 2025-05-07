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


fetchNetworkLogs();

setInterval(fetchNetworkLogs, 3000); 

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

