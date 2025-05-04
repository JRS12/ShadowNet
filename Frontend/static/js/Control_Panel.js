function navigateTo(page) {
  let currentPath = window.location.pathname;
  let basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);
  window.location.href = basePath + page;
}
var opts = {
  angle: 0,
  lineWidth: 0.3,
  radiusScale: 1,
  pointer: { length: 0.6, strokeWidth: 0.05, color: '#fff' },
  limitMax: false,
  limitMin: false,
  strokeColor: '#E0E0E0',
  generateGradient: true,
  staticLabels: { font: "10px sans-serif", labels: [2.5, 5, 7.5, 10], fractionDigits: 0 },
  staticZones: [
      {strokeStyle: "#0f0", min: 0, max: 2.5},
      {strokeStyle: "#ff0", min: 2.5, max: 5},
      {strokeStyle: "#f90", min: 5, max: 7.5},
      {strokeStyle: "#f00", min: 7.5, max: 10}
  ]
};

var threatGauge = new Gauge(document.getElementById('threatGauge')).setOptions(opts);
threatGauge.maxValue = 10;
threatGauge.setMinValue(0);
threatGauge.animationSpeed = 64;
threatGauge.set(9);

var attackGauge = new Gauge(document.getElementById('attackGauge')).setOptions(opts);
attackGauge.maxValue = 10;
attackGauge.setMinValue(0);
attackGauge.animationSpeed = 64;
attackGauge.set(9);

function updateAttackStatus(status) {
localStorage.setItem("attackStatus", status); 
}

setTimeout(() => {
document.getElementById("attackStatus").textContent = "UNDER ATTACK";
document.getElementById("attackStatus").classList.add("under-attack");
updateAttackStatus("UNDER ATTACK");
}, 10000);

window.addEventListener('storage', function(event) {
if (event.key === "attackStatus") {
checkSystemStatus();
}
});

function setAttackStatus(status) {
  let attackIndicator = document.getElementById("attackStatus");
  let attackCards = document.querySelectorAll(".dashboard-card");
  let profileIcon = document.getElementById("profileIcon");
  let notification = document.getElementById("attackNotification");

  if (status === "UNDER ATTACK") {
      attackIndicator.textContent = "UNDER ATTACK";
      attackIndicator.classList.add("under-attack");
      attackCards.forEach(card => card.classList.add("glowing"));
      profileIcon.style.borderColor = "red"; 
      notification.style.display = "block"; 
      setTimeout(() => {
          notification.style.display = "none"; 
      }, 5000);
  } else {
      attackIndicator.textContent = "SAFE";
      attackIndicator.classList.remove("under-attack");
      attackCards.forEach(card => card.classList.remove("glowing"));
      profileIcon.style.borderColor = "cyan"; 
      notification.style.display = "none"; 
  }
}

setAttackStatus("SAFE");

document.getElementById('profileIcon').onclick = function() {
 var dropdown = document.getElementById("profileDropdown");
 dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.getElementById('accountOption').onclick = function() {
  document.getElementById('accountModal').style.display = "block";
  document.getElementById("profileDropdown").style.display = "none"; 
}

document.getElementById('closeModal').onclick = function() {
  document.getElementById('accountModal').style.display = "none";
}

document.getElementById('saveButton').onclick = function() {
  alert("Account information saved!");
  document.getElementById('accountModal').style.display = "none";
}

document.getElementById('changeProfileButton').onclick = function() {
  document.getElementById('profilePicture').click(); 
}

document.getElementById('viewProfileButton').onclick = function() {
  document.getElementById('viewProfileModal').style.display = "block";
  document.getElementById('viewProfilePictureDisplay').src = document.getElementById('profilePictureDisplay').src; 
}

document.getElementById('closeViewModal').onclick = function() {
  document.getElementById('viewProfileModal').style.display = "none";
}

document.getElementById('profilePicture').onchange = function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          document.getElementById('profilePictureDisplay').src = e.target.result; 
          document.getElementById('profileIcon').style.backgroundImage = `url(${e.target.result})`; 
          document.getElementById('profileIcon').style.backgroundSize = 'cover'; 
          document.getElementById('profileIcon').style.backgroundPosition = 'center';
          document.getElementById('profileInitials').style.display = 'none'; 
      }
      reader.readAsDataURL(file);
  }
}

window.onclick = function(event) {
  var accountModal = document.getElementById('accountModal');
  var viewModal = document.getElementById('viewProfileModal');
  if (event.target == accountModal) {
      accountModal.style.display = "none";
  }
  if (event.target == viewModal) {
      viewModal.style.display = "none";
  }
}

function updateSystemHealth() {
const cpuUsage = Math.floor(Math.random() * 100);
const ramUsage = Math.floor(Math.random() * 100);
const networkTraffic = Math.floor(Math.random() * 500) + " KB/s";

document.getElementById('cpuUsage').textContent = cpuUsage + "%";
document.getElementById('cpuStatus').textContent = cpuUsage < 80 ? "Normal" : "High Usage";
document.getElementById('cpuCard').style.borderColor = getColor(cpuUsage); 
document.getElementById('cpuCard').style.boxShadow = `0 0 10px ${getColor(cpuUsage)}`; 

document.getElementById('ramUsage').textContent = ramUsage + "%";
document.getElementById('ramStatus').textContent = ramUsage < 80 ? "Normal" : "High Usage";
document.getElementById('ramCard').style.borderColor = getColor(ramUsage);
document.getElementById('ramCard').style.boxShadow = `0 0 10px ${getColor(ramUsage)}`;

document.getElementById('networkTraffic').textContent = networkTraffic;
document.getElementById('networkStatus').textContent = "Normal"; 
document.getElementById('networkCard').style.borderColor = "cyan"; 
document.getElementById('networkCard').style.boxShadow = "0 0 10px cyan";
}


function getColor(usage) {
if (usage >= 0 && usage <= 25) {
return "green"; 
} else if (usage > 25 && usage <= 50) {
return "yellow"; 
} else if (usage > 50 && usage <= 75) {
return "orange"; 
} else {
return "red"; 
}
}

setInterval(updateSystemHealth, 2000);

setTimeout(() => setAttackStatus("UNDER ATTACK"), 10000);

