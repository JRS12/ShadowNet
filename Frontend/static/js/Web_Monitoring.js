console.log("Web_Monitoring.js loaded");

function fetchLogs() {
  fetch('/web_monitoring/get_web_logs')
  .then(response => {
      if (!response.ok) {
        console.error("Failed to fetch logs. Status:", response.status);
        return [];
      }
      return response.json();
    })
    .then(data => {
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = ""; // Clear table before inserting updated rows

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
    })
    .catch(error => {
      console.error("Error parsing logs:", error);
    });
}

// Run once immediately
fetchLogs();

// Fetch every 3 seconds (3000 milliseconds)
setInterval(fetchLogs, 3000);
