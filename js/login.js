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
            toggle.textContent = "👁️";
        } else {
            input.type = "password";
            toggle.textContent = "👁️‍🗨️";
        }
    });
});

// Registro de usuario
document.querySelector("#register .btn-login").addEventListener("click", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email-reg").value.trim();
    const password = document.getElementById("password-reg").value;
    if (!nombre || !email || !password) {
        alert("Por favor completa todos los campos");
        return;
    }
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("password", password);
    const res = await fetch("php/register.php", {
        method: "POST",
        body: formData
    });
    const data = await res.json();
    alert(data.message);
    if (data.success) {
        // Cambiar a pestaña login automáticamente
        document.querySelector('.tab[data-tab="login"]').click();
        document.getElementById("email").value = email;
    }
});

// Login de usuario
document.querySelector("#login .btn-login").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || !password) {
        alert("Por favor ingresa tu correo y contraseña");
        return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const res = await fetch("php/login.php", {
        method: "POST",
        body: formData
    });
    const data = await res.json();
    if (data.success) {
        alert("Bienvenido, " + data.nombre);
        // Redirigir a lobby.html o página principal
        window.location.href = "lobby.html";
    } else {
        alert(data.message);
    }
});
