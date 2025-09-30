<?php

session_start();

//importar conexion de base de datos
include 'conexion_base.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


// Recoger y sanitizar datos
$nombre = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$email    = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$password = $_POST['password'] ?? '';

// Validaciones básicas
if (!$nombre || !$apellido || !$email || !$password) {
    $_SESSION['mensaje'] = "❌ Todos los campos son obligatorios.";
    header("Location: ../login.html");
    exit;
}

// Validar nombre y apellido
if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $nombre)) {
    $_SESSION['mensaje'] = "❌ El nombre solo puede contener letras y espacios.";
    header("Location: ../login.html");
    exit;
}
if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $apellido)) {
    $_SESSION['mensaje'] = "❌ El apellido solo puede contener letras y espacios.";
    header("Location: ../login.html");
    exit;
}

// Validar correo
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['mensaje'] = "❌ Correo electrónico no válido.";
    header("Location: ../login.html");
    exit;
}

//Encriptar la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // Verificar correo único
    $checkStmt = $conexion->prepare("SELECT ID_Usuarios FROM usuarios WHERE Email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkStmt->store_result();
    if ($checkStmt->num_rows > 0) {
        $_SESSION['mensaje'] = "❌ Este correo ya está registrado.";
        header("Location: ../login.html");
        exit;
    }
    $checkStmt->close();

    // Insertar usuario con nombre y apellido
    $stmt = $conexion->prepare("INSERT INTO usuarios (Nombres, Apellidos, Email, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $apellido, $email, $hashedPassword);
    $stmt->execute();

} catch (Exception $e) {
    $_SESSION['mensaje'] = "❌ Excepción: " . $e->getMessage();
} finally {
    if (isset($stmt) && $stmt) $stmt->close();
    $conexion->close();
}

// Redirigir al login
header("Location: ../login.html");
exit;
?>