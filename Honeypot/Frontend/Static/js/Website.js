document.addEventListener("keydown", function (e) {
  const keystrokeLog = {
      key: e.key,
      username: sessionStorage.getItem('username') || 'Guest', // or capture from login
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      session_active: true
  };

  fetch("http://0.0.0.0:8080/log_keystroke", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keystrokeLog)
  });
});

window.addEventListener("beforeunload", function () {
  const sessionEndLog = {
      key: "Session Ended",
      username: sessionStorage.getItem('username') || 'Guest',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      session_active: false
  };

  fetch("http://0.0.0.0:8080/log_keystroke", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionEndLog)
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) {
      form.addEventListener("submit", function (e) {
          e.preventDefault();
          const data = new FormData(form);
          fetch("http://0.0.0.0:8080/upload", {
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

document.getElementById("saveProfileBtn")?.addEventListener("click", () => {
  const data = {
      username: document.getElementById("profileUsername").value,
      email: document.getElementById("profileEmail").value,
      newPassword: document.getElementById("profileNewPassword").value,
      oldPassword: document.getElementById("profileOldPassword").value,
  };

  fetch("http://0.0.0.0:8080/update_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(data => {
      alert(data.message || "Profile updated.");
  });
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  fetch("http://0.0.0.0:8080/logout", {
      method: "POST"
  }).then(() => {
      window.location.href = "/login";
  });
});

document.querySelectorAll(".xss-link")?.forEach(link => {
  link.addEventListener("click", () => {
      const payload = "<script>alert('XSS Attack!')</script>";
      document.getElementById("vulnerableOutput").innerHTML = payload;
  });
});

document.getElementById("sqliForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("sqliInput").value;
  fetch("http://0.0.0.0:8080/check_login?user=" + encodeURIComponent(input))
      .then(res => res.text())
      .then(text => alert("Server Response: " + text));
});

function toggleProfileSection() {
  const section = document.getElementById('profileSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function saveProfileChanges() {
  const username = document.getElementById('usernameField').value;
  const email = document.getElementById('emailField').value;
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const photo = document.getElementById('changePhotoInput').files[0];

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


const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

profileIcon.addEventListener("click", function (e) {
  e.stopPropagation();
  profileMenu.style.display = "block";
});

document.addEventListener("click", function () {
  profileMenu.style.display = "none";
});

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

document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.getElementById('uploadForm');
  uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(uploadForm);

      fetch(uploadForm.action, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          }
      })
      .then(response => response.json())
      .then(data => {
          $('#uploadModal').modal('hide');
          uploadForm.reset();

          const masonry = document.querySelector('.masonry');
          const newItem = document.createElement('div');
          newItem.classList.add('masonry-item');

          const uploadedFileName = data.fileName;

          const filePath = "Database/File_Uploads/" + uploadedFileName;

          const extension = uploadedFileName.split('.').pop().toLowerCase();

          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
              const img = document.createElement('img');
              img.src = filePath;
              img.alt = data.caption || 'Uploaded Image';
              img.style.maxWidth = "200px";
              newItem.appendChild(img);
          } else {
              const fileLink = document.createElement('a');
              fileLink.href = filePath;
              fileLink.textContent = "Download: " + uploadedFileName;
              fileLink.target = "_blank";
              newItem.appendChild(fileLink);
          }

          masonry.prepend(newItem); 
      })
      .catch(error => {
          console.error('Upload failed:', error);
      });
  });
});// ========== Keystroke Monitoring and Attack Keyword Matching ==========
document.addEventListener("keydown", function (e) {
  const key = e.key;

  fetch("/log_keystroke", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: key,
      timestamp: new Date().toISOString(),
    }),
  });
});

window.addEventListener("beforeunload", function () {
  fetch("/log_keystroke", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: "Session Ended",
      timestamp: new Date().toISOString(),
    }),
  });
});

// ========== File Upload ==========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);

      fetch("/upload", {
        method: "POST",
        body: data
      })
        .then(res => res.json())
        .then(res => {
          alert(res.message || "File uploaded!");
          window.location.reload();
        })
        .catch(err => {
          console.error("Upload failed:", err);
        });
    });
  }
});

// ========== Profile Section ==========
document.getElementById("saveProfileBtn")?.addEventListener("click", () => {
  const data = {
    username: document.getElementById("profileUsername").value,
    email: document.getElementById("profileEmail").value,
    newPassword: document.getElementById("profileNewPassword").value,
    oldPassword: document.getElementById("profileOldPassword").value,
  };

  fetch("/update_profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Profile updated.");
    });
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  fetch("/logout", { method: "POST" })
    .then(() => { window.location.href = "/login"; });
});

// ========== XSS Simulation ==========
document.querySelectorAll(".xss-link")?.forEach(link => {
  link.addEventListener("click", () => {
    const payload = "<script>alert('XSS Attack!')</script>";
    document.getElementById("vulnerableOutput").innerHTML = payload;
  });
});

// ========== SQL Injection Form ==========
document.getElementById("sqliForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("sqliInput").value;
  fetch("/check_login?user=" + encodeURIComponent(input))
    .then(res => res.text())
    .then(text => alert("Server Response: " + text));
});


