console.log("Web_Monitoring.js loaded");

function fetchLogs() {
  fetch('/web_monitoring/get_monitoring_config')
    .then(response => response.json())
    .then(config => {
      if (!config.web_monitoring) {
        console.log("[INFO] Web monitoring disabled.");
        document.querySelector("tbody").innerHTML = "<tr><td colspan='9'>Monitoring Disabled</td></tr>";
        return;
      }

      fetch('/web_monitoring/get_web_logs')
        .then(response => response.json())
        .then(data => {
          const tbody = document.querySelector("tbody");
          tbody.innerHTML = "";
          data.forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${entry.ip}</td>
              <td>${entry.date}</td>
              <td>${entry.time}</td>
              <td>${entry.userid}</td>
              <td>${entry.user_agent}</td>
              <td>${entry.path}</td>
              <td>${entry.method}</td>
              <td>${entry.code}</td>
              <td>${entry.session}</td>
            `;
            tbody.appendChild(row);
          });
        });
    })
    .catch(error => {
      console.error("Error loading logs:", error);
    });
}

function fetchControlStatus() {
  fetch('/web_monitoring/control_status.json')
    .then(response => response.json())
    .then(data => {
      const indicator = document.getElementById("attackIndicator");
      if (indicator) {
        indicator.textContent = data.status === "UNDER ATTACK" ? "⚠️ UNDER ATTACK" : "✅ SAFE";
        indicator.style.color = data.status === "UNDER ATTACK" ? "red" : "green";
      }
    })
    .catch(err => console.error("Failed to fetch control status:", err));
}

// Initial call
fetchLogs();
fetchControlStatus();

// Repeat
setInterval(fetchLogs, 3000);
setInterval(fetchControlStatus, 1000);
