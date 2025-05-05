console.log("✅ File_Forensics.js loaded");

function fetchFileForensics() {
  fetch('/file/get_file_forensics_data')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.querySelector('#forensics-table tbody');
          tableBody.innerHTML = '';

          data.forEach(entry => {
              const row = document.createElement('tr');

              row.innerHTML = `
                  <td>${entry.username}</td>
                  <td>${entry.email}</td>
                  <td>${entry.ip_address}</td>
                  <td>${entry.upload_date}</td>
                  <td>${entry.upload_time}</td>
                  <td>${entry.malicious}</td>
                  <td>${entry.suspicious}</td>
                  <td>${entry.harmless}</td>
                  <td>${entry.type_description}</td>
                  <td>${entry.file_type}</td>
                  <td>${entry.meaningful_name}</td>
                  <td>${entry.detection_ratio}</td>
                  <td>${entry.scan_date}</td>
                  <td>${entry.reputation}</td>
                  <td>${entry.tags}</td>
              `;
              tableBody.appendChild(row);
          });
      });
}

function fetchControlStatus() {
  fetch('/file/get_control_status')
      .then(response => response.json())
      .then(data => {
          const controlStatus = document.getElementById('control-status');
          controlStatus.textContent = "Control Status: " + (data.status || 'Unknown');
          controlStatus.style.color = data.status === "UNDER ATTACK" ? "red" : "green";
      });
}

setInterval(fetchControlStatus, 1000);  
setInterval(fetchFileForensics, 3000);  

window.onload = () => {
  fetchControlStatus();
  fetchFileForensics();
};
