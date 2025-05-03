function navigateTo(page) {
  window.location.href = page; 
}
function updateWebStatus() {
fetch("control_status.json") 
.then(response => response.json())
.then(data => {
  var webStatusIndicator = document.getElementById("webStatusIndicator");
  if (data.status === "UNDER ATTACK") {
      webStatusIndicator.textContent = "Under Attack";
      webStatusIndicator.classList.add("under-attack");
  } else {
      webStatusIndicator.textContent = "Safe";
      webStatusIndicator.classList.remove("under-attack");
  }
})
.catch(error => console.error("Error fetching attack status:", error));
}

setInterval(updateWebStatus, 5000);

function fetchLogs() {
  fetch('/get_web_logs')
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
}

setInterval(fetchLogs, 5000);
fetchLogs(); 
