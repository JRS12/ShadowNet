// script.js - Script for System Setup Panel

function navigateTo(page) {
    window.location.href = page;
  }
  
  function updateNetworkStatus() {
    const attackStatus = localStorage.getItem("attackStatus");
    const networkStatus = document.getElementById("networkStatus");
  
    if (attackStatus === "UNDER ATTACK") {
      networkStatus.textContent = "Under Attack";
      networkStatus.classList.add("under-attack");
      networkStatus.style.border = "2px solid red";
      networkStatus.style.boxShadow = "0 0 15px red";
    } else {
      networkStatus.textContent = "Safe";
      networkStatus.classList.remove("under-attack");
      networkStatus.style.border = "2px solid green";
      networkStatus.style.boxShadow = "0 0 15px green";
    }
  }
  
  setInterval(updateNetworkStatus, 1000);
  