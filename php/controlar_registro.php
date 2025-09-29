<?php

session_start();

//importar conexion de base de datos
include 'conexion_base.php';

// Recibir datos del formulario
$nombre   = $_POST['nombre'] ?? '';
$apellido   = $_POST['apellido'] ?? '';
$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

//Encriptar la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar datos en la base de manera segura
$sql = "INSERT INTO usuarios (Nombres, Apellidos, Email, Password) VALUES (?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

//verificar si fallo la preparacion 
if ($stmt === false)
{
	die("Error al preparar la consulta: " . $conexion->error);
}

//Asignar parametros a la sentencia preparada
$stmt->bind_param("ssss", $nombre, $apellido, $email, $hashedPassword);


//Ejecutar
if ($stmt->execute()) 
{
	//Guardar mensaje en sesion 
	$_Session['mensaje'] = "Registro exitoso, Por favor inicia sesion.";

} else 
{
	//Guardar mensaje en sesion 
	$_Session['mensaje'] = "Error: " . $stmt->error;
}

$stmt->close();
$conexion->close();

header("Location: ../index.php");
exit;

?>