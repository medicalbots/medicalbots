<?php
// Configuración de la base de datos
$host = 'localhost';
$user = 'root';
$password = '';
$db = 'saludia';

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

// Recibir datos del formulario
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$nombre || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

// Verificar si el correo ya existe
$stmt = $conn->prepare('SELECT id FROM usuarios WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El correo ya está registrado']);
    exit;
}
$stmt->close();

// Encriptar la contraseña
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conn->prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $nombre, $email, $hash);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
}
$stmt->close();
$conn->close();
?>