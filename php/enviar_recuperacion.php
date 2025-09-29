<?php
include 'conexion_base.php';

$email = trim($_POST['email'] ?? '');

if (!$email) {
    die("❌ Debes ingresar un correo.");
}

$stmt = $conexion->prepare("SELECT ID_Usuarios, Nombres, Apellidos FROM usuarios WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();

    $token = bin2hex(random_bytes(32));
    $expira = date("Y-m-d H:i:s", strtotime("+1 hour"));

    $stmt = $conexion->prepare("INSERT INTO recuperacion (ID_Usuarios, token, expira) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $usuario['ID_Usuarios'], $token, $expira);
    $stmt->execute();

    $link = "http://tu-dominio.com/php/reset.php?token=" . $token;


    $asunto = "Recuperar contraseña";
    $mensaje = "Hola " . $usuario['Nombres'] . " " . $usuario['Apellidos'] . ",\n\n".
            "Haz clic en el siguiente enlace para restablecer tu contraseña:\n".
            $link . "\n\nEste enlace expira en 1 hora.";
    $headers = "From: no-reply@tu-dominio.com\r\n";

    mail($email, $asunto, $mensaje, $headers);

    echo "📩 Revisa tu correo para continuar con la recuperación.";
} else {
    echo "❌ No encontramos una cuenta con ese correo.";
}

$stmt->close();
$conexion->close();
?>
