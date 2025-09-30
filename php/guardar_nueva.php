<?php
include 'conexion_base.php';

$token = $_POST['token'] ?? '';
$nueva = $_POST['nueva'] ?? '';

if (!$token || !$nueva) {
    die("❌ Datos incompletos.");
}

// Validar token
$stmt = $conexion->prepare("SELECT * FROM recuperacion WHERE token = ? AND expira > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $row = $resultado->fetch_assoc();

    // Encriptar nueva contraseña
    $hashed = password_hash($nueva, PASSWORD_DEFAULT);

    // Actualizar contraseña
    $stmt = $conexion->prepare("UPDATE usuarios SET Password = ? WHERE ID_Usuarios = ?");
    $stmt->bind_param("si", $hashed, $row['ID_Usuarios']);
    $stmt->execute();

    // Eliminar token
    $stmt = $conexion->prepare("DELETE FROM recuperacion WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();

    echo "✅ Contraseña actualizada correctamente. Ya puedes iniciar sesión.";
} else {
    echo "❌ Token inválido o caducado.";
}
