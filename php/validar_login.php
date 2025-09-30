<?php
session_start();
include 'conexion_base.php';

$user = trim($_POST['user']);
$pass = $_POST['pass'];

$sql = "SELECT * FROM usuarios WHERE Email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $usuarios = $resultado->fetch_assoc();

    // Depuración: ver si el hash está completo
    // var_dump($pass, $usuarios['Password']); exit;

    if (password_verify($pass, $usuarios['Password'])) {
		// Guardar datos
		$_SESSION['ID_Usuarios'] = $usuarios['ID_Usuarios'];
        $_SESSION['Nombres'] = $usuarios['Nombres'];
        $_SESSION['Apellidos'] = $usuarios['Apellidos'];
		$_SESSION['Email'] = $usuarios['Email'];

        header("Location: ../lobby.html");
        exit();
    } else {
        echo "❌ Contraseña incorrecta.";
    }
} else {
    echo "❌ Usuario no encontrado.";
}

$stmt->close();
$conexion->close();
?>
<?php
session_start();
include 'conexion_base.php';

$user = trim($_POST['user']);
$pass = $_POST['pass'];

$sql = "SELECT * FROM usuarios WHERE Email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $usuarios = $resultado->fetch_assoc();

    // Depuración: ver si el hash está completo
    // var_dump($pass, $usuarios['Password']); exit;

    if (password_verify($pass, $usuarios['Password'])) {
		// Guardar datos
		$_SESSION['ID_Usuarios'] = $usuarios['ID_Usuarios'];
        $_SESSION['Nombres'] = $usuarios['Nombres'];
        $_SESSION['Apellidos'] = $usuarios['Apellidos'];
		$_SESSION['Email'] = $usuarios['Email'];

        header("Location: ../lobby.html");
        exit();
    } else {
        echo "❌ Contraseña incorrecta.";
    }
} else {
    echo "❌ Usuario no encontrado.";
}

$stmt->close();
$conexion->close();
?>
