<?php

$host = "127.0.0.1";
$port = "3308";
$dbname = "notre_histoire";
$username = "notre_histoire";
$password = "notre_histoire";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $pdo->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}