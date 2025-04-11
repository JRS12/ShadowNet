function filterByUsername() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.masonry-item');
  
    cards.forEach(card => {
      const username = card.getAttribute('data-username')?.toLowerCase() || '';
      card.style.display = username.includes(input) ? 'block' : 'none';
    });
  }
  
  document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterByUsername();
    }
  });
  
  $('#viewModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var imageSrc = button.data('img');
    var caption = button.data('caption');
    var modal = $(this);
    modal.find('#modalImage').attr('src', imageSrc);
    modal.find('#modalCaption').text(caption);
    modal.find('#likeCount').text(Math.floor(Math.random() * 10 + 1));
  });
  
  function setActive(element) {
    document.querySelectorAll('.sidebar i').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
  }
  
  function toggleProfileSection() {
    const section = document.getElementById('profileSection');
    section.style.display = section.style.display === 'block' ? 'none' : 'block';
  }
  
  document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const imageInput = document.getElementById('postImage');
    const caption = document.getElementById('caption').value;
  
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const gallery = document.getElementById('imageGallery');
        const newDiv = document.createElement('div');
        newDiv.classList.add('masonry-item');
        newDiv.setAttribute('data-toggle', 'modal');
        newDiv.setAttribute('data-target', '#viewModal');
        newDiv.setAttribute('data-img', e.target.result);
        newDiv.setAttribute('data-caption', caption);
  
        newDiv.innerHTML = `
          <img src="${e.target.result}" alt="User  Upload">
          <button class="like-btn"><i class="bi bi-heart"></i></button>
        `;
        gallery.prepend(newDiv);
        $('#uploadModal').modal('hide');
        document.getElementById('uploadForm').reset();
      };
      reader.readAsDataURL(imageInput.files[0]);
    }
  });
  
  function toggleDropdownMenu() {
    const menu = document.querySelector('.profile-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  }
  
  window.addEventListener('click', function (e) {
    const menu = document.querySelector('.profile-menu');
    const icon = document.querySelector('.profile-icon');
    if (!menu.contains(e.target) && e.target !== icon) {
      menu.style.display = 'none';
    }
  });
  
  window.addEventListener('click', function (event) {
    const profileSection = document.getElementById('profileSection');
    const profileMenu = document.querySelector('.profile-menu');
    const profileIcon = document.querySelector('.profile-icon');
  
    const clickedInsideProfile = profileSection.contains(event.target);
    const clickedOnIcon = profileIcon.contains(event.target);
    const clickedInsideMenu = profileMenu.contains(event.target);
  
    if (!clickedInsideProfile && !clickedOnIcon && !clickedInsideMenu) {
      profileSection.style.display = 'none';
      profileMenu.style.display = 'none';
    }
  });