function navigateTo(page) {
    window.location.href = page;
  }
  
  function setAttackStatus(status) {
    localStorage.setItem("attackStatus", status);
    updateNetworkStatus();
  }
  
  function updateNetworkStatus() {
    const networkStatus = document.getElementById("networkStatus");
    const status = localStorage.getItem("attackStatus");
  
    if (status === "UNDER ATTACK") {
      networkStatus.textContent = "Under Attack";
      networkStatus.style.border = "2px solid red";
      networkStatus.style.color = "red";
      networkStatus.style.boxShadow = "0 0 15px red";
    } else {
      networkStatus.textContent = "Safe";
      networkStatus.style.border = "2px solid green";
      networkStatus.style.color = "cyan";
      networkStatus.style.boxShadow = "0 0 15px cyan";
    }
  }
  
  setInterval(updateNetworkStatus, 1000);
  
  window.onload = updateNetworkStatus;
  