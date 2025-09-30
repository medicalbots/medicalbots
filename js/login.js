const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".formulario");

// Activar pestaña según parámetro de la URL
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));
        const tabBtn = Array.from(tabs).find(t => t.dataset.tab === tabParam);
        const formDiv = document.getElementById(tabParam);
        if (tabBtn && formDiv) {
            tabBtn.classList.add("active");
            formDiv.classList.add("active");
        }
    }
});

// Alternar entre login y registro
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

// Mostrar/ocultar contraseña
document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
        const targetId = toggle.getAttribute("data-target");
        const input = document.getElementById(targetId);

        if (input.type === "password") {
            input.type = "text";
            toggle.textContent = "🙉"; // ojo abierto
        } else {
            input.type = "password";
            toggle.textContent = "🙈"; // ojo cerrado
        }
    });
});
