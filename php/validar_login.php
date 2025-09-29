<?php

session_start();

include 'conexion_base.php';

$user = $_POST['user'];
$pass = $_POST['pass'];

//Buscar usuario por correo
$sql = "SELECT * FROM usuarios WHERE Email = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0)
{
	$usuarios = $resultado->fetch_assoc();

	//verificar contraseña
	if (password_verify($pass, $usuarios['Password']))
	{
		//Guardar datos
		$_SESSION['ID_Usuarios'] = $usuarios['ID_Usuarios'];
		$_SESSION['Nombres'] = $usuarios['Nombres'];
		$_SESSION['Apellidos'] = $usuarios['Apellidos'];
		$_SESSION['Email'] = $usuarios['Email'];

		//Redirigir al lobby
		header("Location: ../lobby.html");
		exit();
	} else
	{
		echo "contraseña incorrecta";
	}
} else
{
	echo "Usuario no encontrado";
}

$stmt->close();
$conexion->close();

?>