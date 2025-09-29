<?php
$host = 'localhost';
$user = 'root';
$password = '';
$db = 'saludia';

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

$stmt = $conn->prepare('SELECT id, password, nombre FROM usuarios WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        echo json_encode(['success' => true, 'message' => 'Login exitoso', 'nombre' => $row['nombre']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Correo no registrado']);
}
$stmt->close();
$conn->close();
?>