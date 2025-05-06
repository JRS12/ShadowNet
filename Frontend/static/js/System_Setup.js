function navigateTo(page) {
  window.location.href = page; 
}

document.getElementById('startServerButton').onclick = function() {
  alert("Server started successfully!");
  document.getElementById('attackInfo').textContent = "Server is running.";
  document.getElementById('troubleshootButton').disabled = false; 
}

document.getElementById('stopServerButton').onclick = function() {
  alert("Server stopped successfully!");
  document.getElementById('attackInfo').textContent = ""; 
  document.getElementById('webMonitoringData').textContent = ""; 
  document.getElementById('networkMonitoringData').textContent = ""; 
  document.getElementById('webMonitoringToggle').checked = false; 
  document.getElementById('networkMonitoringToggle').checked = false; 
  document.getElementById('troubleshootButton').disabled = true; 
}

document.getElementById('troubleshootButton').onclick = function() {
  var attackInfo = document.getElementById("attackInfo");
  attackInfo.textContent = "Attacking IP: http://0.0.0.0:8080";
}

document.getElementById('webMonitoringToggle').addEventListener('change', function() {
  var webMonitoringData = document.getElementById('webMonitoringData');
  if (this.checked) {
      webMonitoringData.textContent = "Monitoring data for attacking site...";
  } else {
      webMonitoringData.textContent = "";
  }
});

document.getElementById('networkMonitoringToggle').addEventListener('change', function() {
  var networkMonitoringData = document.getElementById('networkMonitoringData');
  if (this.checked) {
      networkMonitoringData.textContent = "Network data for attacking site...";
  } else {
      networkMonitoringData.textContent = ""; 
  }
});

function checkSystemStatus() {
var attackStatus = localStorage.getItem("attackStatus");
var systemStatus = document.getElementById("systemStatus");

if (attackStatus === "UNDER ATTACK") {
systemStatus.textContent = "Under Attack";
systemStatus.classList.add("under-attack");
systemStatus.style.border = "2px solid red";
systemStatus.style.boxShadow = "0 0 15px red";
} else {
systemStatus.textContent = "Safe";
systemStatus.classList.remove("under-attack");
systemStatus.style.border = "2px solid green";
systemStatus.style.boxShadow = "0 0 15px green";
}
}

function updateSystemStatus() {
var attackStatus = localStorage.getItem("attackStatus") || "Safe";
var systemStatus = document.getElementById("systemStatus");

if (attackStatus === "UNDER ATTACK") {
systemStatus.textContent = "Under Attack";
systemStatus.classList.add("under-attack");
systemStatus.style.border = "2px solid red";
systemStatus.style.boxShadow = "0 0 15px red";
} else {
systemStatus.textContent = "Safe";
systemStatus.classList.remove("under-attack");
systemStatus.style.border = "2px solid green";
systemStatus.style.boxShadow = "0 0 15px green";
}
}

setInterval(updateSystemStatus, 1000);

function updateMonitoringAccess() {
var isServerRunning = localStorage.getItem("serverRunning") === "true";
var isTroubleshooting = localStorage.getItem("troubleshootEnabled") === "true";

var webMonitoringToggle = document.getElementById('webMonitoringToggle');
var networkMonitoringToggle = document.getElementById('networkMonitoringToggle');

if (isServerRunning && isTroubleshooting) {
webMonitoringToggle.disabled = false;
networkMonitoringToggle.disabled = false;
} else {
webMonitoringToggle.disabled = true;
networkMonitoringToggle.disabled = true;
webMonitoringToggle.checked = false;
networkMonitoringToggle.checked = false;
}
}

document.getElementById('startServerButton').addEventListener('click', function () {
localStorage.setItem("serverRunning", "true");
updateMonitoringAccess();
});

document.getElementById('stopServerButton').addEventListener('click', function () {
localStorage.setItem("serverRunning", "false");
localStorage.setItem("troubleshootEnabled", "false");
updateMonitoringAccess();
});

document.getElementById('troubleshootButton').addEventListener('click', function () {
localStorage.setItem("troubleshootEnabled", "true");
updateMonitoringAccess();
});

setInterval(updateMonitoringAccess, 1000);

function syncSystemStatus() {
var attackStatus = localStorage.getItem("attackStatus");
var systemStatus = document.getElementById("systemStatus");

if (attackStatus === "UNDER ATTACK") {
systemStatus.textContent = "Under Attack";
systemStatus.classList.add("under-attack");
systemStatus.style.border = "2px solid red";
systemStatus.style.boxShadow = "0 0 15px red";
} else {
systemStatus.textContent = "Safe";
systemStatus.classList.remove("under-attack");
systemStatus.style.border = "2px solid green";
systemStatus.style.boxShadow = "0 0 15px green";
}
}

setInterval(syncSystemStatus, 1000);

document.getElementById('startServerButton').addEventListener('click', function () {
  fetch('/system/start_server', { method: 'POST' })
    .then(res => res.json())
    .then(data => console.log("Server status:", data.status));
});

document.getElementById('stopServerButton').addEventListener('click', function () {
  fetch('/system/stop_server', { method: 'POST' })
    .then(res => res.json())
    .then(data => console.log("Server stopped:", data.status));
});

document.getElementById('webMonitoringToggle').addEventListener('change', function () {
  fetch('/system/toggle_monitoring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "web_monitoring", enabled: this.checked })
  });
});

document.getElementById('networkMonitoringToggle').addEventListener('change', function () {
  fetch('/system/toggle_monitoring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "network_monitoring", enabled: this.checked })
  });
});
