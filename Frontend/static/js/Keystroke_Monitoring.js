function loadKeystrokeLogs() {
  fetch('/get_keystroke_logs')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('keystroke-log-body');
          tableBody.innerHTML = "";

          data.forEach(log => {
              const row = document.createElement('tr');

              row.innerHTML = `
                  <td>${log.username}</td>
                  <td>${log.ip_address}</td>
                  <td>${log.date}</td>
                  <td>${log.time}</td>
                  <td>${log.keystroke}</td>
                  <td>${log.attack_status}</td>
                  <td>${log.attack_type}</td>
              `;

              if (log.attack_status === "UNDER ATTACK") {
                  row.style.backgroundColor = "#ffcccc";
              }

              tableBody.appendChild(row);
          });

          const indicator = document.getElementById("attack-indicator");
          const underAttack = data.some(log => log.attack_status === "UNDER ATTACK");

          indicator.textContent = underAttack ? "UNDER ATTACK" : "SAFE";
          indicator.style.color = underAttack ? "red" : "green";
      });
}

setInterval(loadKeystrokeLogs, 1000);
window.onload = loadKeystrokeLogs;
