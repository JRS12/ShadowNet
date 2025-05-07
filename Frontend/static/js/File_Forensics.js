console.log("File_Forensics.js loaded");

function fetchFileForensicsLogs() {
  fetch('/file_forensics/get_file_logs')
    .then(response => {
      if (!response.ok) {
        console.error("Failed to fetch file logs. Status:", response.status);
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
          <td>${entry.username || ''}</td>
          <td>${entry.email || ''}</td>
          <td>${entry.ip || ''}</td>
          <td>${entry.upload_date || ''}</td>
          <td>${entry.upload_time || ''}</td>
          <td>${entry.malicious || 0}</td>
          <td>${entry.suspicious || 0}</td>
          <td>${entry.type_description || ''}</td>
          <td>${entry.meaningful_name || ''}</td>
          <td>${entry.file_type || ''}</td>
          <td>${entry.engine_results || ''}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error loading file logs:", error);
    });
}

fetchFileForensicsLogs();

setInterval(fetchFileForensicsLogs, 3000);

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
