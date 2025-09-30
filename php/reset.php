<?php
include 'conexion_base.php';

$token = $_GET['token'] ?? '';

$stmt = $conexion->prepare("SELECT * FROM recuperacion WHERE token = ? AND expira > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    // Formulario para ingresar nueva contraseña
    echo '<h2>Restablecer contraseña</h2>
          <form method="POST" action="guardar_nueva.php">
            <input type="hidden" name="token" value="'.$token.'">
            <label>Nueva contraseña:</label>
            <input type="password" name="nueva" required><br><br>
            <button type="submit">Guardar</button>
          </form>';
} else {
    echo "❌ El enlace es inválido o ha expirado.";
}
