<?php

session_set_cookie_params([
    "httponly" => true,
    "secure" => false,
    "samesite" => "Lax"
]);

session_start();

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Utilisateur non connecté."
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $_SESSION["user_id"],
        "nom" => $_SESSION["user_nom"],
        "email" => $_SESSION["user_email"]
    ]
]);
