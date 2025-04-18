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

setInterval(updateWebStatus, 1000);