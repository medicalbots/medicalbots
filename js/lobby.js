const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Menú de perfil desplegable
const profileImg = document.getElementById("profile-img");
const profileMenu = document.getElementById("profile-menu");

profileImg.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
    if (profileMenu.classList.contains("active") && !profileMenu.contains(e.target) && e.target !== profileImg) {
        profileMenu.classList.remove("active");
    }
});

// Actualizar saludo con correo del perfil
window.addEventListener('DOMContentLoaded', () => {
    const nameGreeting = document.getElementById('profile-name-greeting');
    const profileName = document.querySelector('.profile-name');
    if (nameGreeting && profileName) {
        nameGreeting.textContent = profileName.textContent;
    }
});