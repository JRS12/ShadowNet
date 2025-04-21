// OWASP Attacking Website JS (Website.js)

// --- 1. Keystroke Logger ---
document.addEventListener("keydown", function (e) {
  const log = {
      key: e.key,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
  };
  // Send data to backend for logging
  fetch("http://12.12.12.12:8080/log_keystroke", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
  });
});

// --- 2. Image Upload with Weak Filter ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) {
      form.addEventListener("submit", function (e) {
          e.preventDefault();
          const data = new FormData(form);
          fetch("http://12.12.12.12:8080/upload", {
              method: "POST",
              body: data
          })
          .then(res => res.json())
          .then(res => {
              alert("Image uploaded!");
              window.location.reload();
          });
      });
  }
});

// --- 3. Profile Editor ---
document.getElementById("saveProfileBtn")?.addEventListener("click", () => {
  const data = {
      username: document.getElementById("profileUsername").value,
      email: document.getElementById("profileEmail").value,
      newPassword: document.getElementById("profileNewPassword").value,
      oldPassword: document.getElementById("profileOldPassword").value,
  };

  fetch("http://12.12.12.12:8080/update_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(data => {
      alert(data.message || "Profile updated.");
  });
});

// --- 4. Logout Handler ---
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  fetch("http://12.12.12.12:8080/logout", {
      method: "POST"
  }).then(() => {
      window.location.href = "/login";
  });
});

// --- 5. Vulnerability Simulators (Simulated XSS, SQLi) ---
document.querySelectorAll(".xss-link")?.forEach(link => {
  link.addEventListener("click", () => {
      const payload = "<script>alert('XSS Attack!')</script>";
      document.getElementById("vulnerableOutput").innerHTML = payload;
  });
});

document.getElementById("sqliForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("sqliInput").value;
  fetch("http://12.12.12.12:8080/check_login?user=" + encodeURIComponent(input))
      .then(res => res.text())
      .then(text => alert("Server Response: " + text));
});

function toggleProfileSection() {
  const section = document.getElementById('profileSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function saveProfileChanges() {
  // You'd send data to backend here
  const username = document.getElementById('usernameField').value;
  const email = document.getElementById('emailField').value;
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const photo = document.getElementById('changePhotoInput').files[0];

  // Store and send to backend...
  alert("Saved changes for: " + username);
}

document.addEventListener("click", function (event) {
  const profileSection = document.getElementById("profileSection");
  const profileMenu = document.getElementById("profileMenu");

  if (
    profileSection &&
    !profileSection.contains(event.target) &&
    !event.target.closest('.profile-dropdown')
  ) {
    profileSection.style.display = "none";
    profileMenu.style.display = "none";
  }
});


// Toggle profile menu
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

profileIcon.addEventListener("click", function (e) {
  e.stopPropagation();
  profileMenu.style.display = "block";
});

// Hide profile menu when clicking outside
document.addEventListener("click", function () {
  profileMenu.style.display = "none";
});

// Modal logic
function openProfileEditor() {
  document.getElementById("profileEditorModal").style.display = "block";
  profileMenu.style.display = "none";
}

function closeProfileEditor() {
  document.getElementById("profileEditorModal").style.display = "none";
}
function toggleDropdownMenu() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Hide dropdown when clicking outside
document.addEventListener("click", function () {
  const menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";
});



function toggleDropdownMenu() {
  const menu = document.getElementById('profileMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function (event) {
  const dropdown = document.querySelector('.profile-dropdown');
  const menu = document.getElementById('profileMenu');
  if (!dropdown.contains(event.target)) {
    menu.style.display = 'none';
  }
});
