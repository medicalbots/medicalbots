<?php

//conexion a la base de datos
$conexion = new mysqli("localhost", "root", "030605", "login_web", "3306");


// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");

?> 
