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

// Cerrar menú al hacer clic en una opción
document.getElementById("profile-menu").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-item")) {
        profileMenu.classList.remove("active");
    }
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

    // Redirección de botones de acciones rápidas
    const quickActions = document.querySelectorAll('.quick-actions button');
    if (quickActions.length >= 4) {
        // Orden: Nueva Consulta, Evaluar Síntomas, Buscar Centros, Ver Eventos
        quickActions[0].addEventListener('click', () => {
            window.location.href = 'chatbot.html';
        });
        quickActions[1].addEventListener('click', () => {
            window.location.href = 'preclasificacion.html';
        });
        quickActions[2].addEventListener('click', () => {
            window.location.href = 'unidad-cercana.html';
        });
        quickActions[3].addEventListener('click', () => {
            window.location.href = 'calendario.html';
        });
    }
});