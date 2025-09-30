// Script para alternar entre secciones del perfil
function mostrarSeccion(seccion) {
	const secciones = ['personal', 'medica', 'actividad'];
	secciones.forEach(id => {
		const sec = document.getElementById(id);
		if (sec) sec.style.display = (id === seccion) ? 'block' : 'none';
	});
	// Actualizar botón activo
	document.querySelectorAll('.sidebar button').forEach(btn => {
		if (btn.getAttribute('data-target') === seccion) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});
}

// Activar por defecto la sección personal al cargar
document.addEventListener('DOMContentLoaded', function() {
	mostrarSeccion('personal');
});
