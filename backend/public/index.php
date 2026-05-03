<?php

// 1. Allow ANY website to access this (Dynamic Origin)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

// 2. Handle the "Preflight" check immediately
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    }
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../bootstrap/app.php';

use billreview\backend\models\Comment;

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD']; // This is received via axios request type.
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove the script name prefix if present
$scriptName = $_SERVER['SCRIPT_NAME'];
if (strpos($requestUri, $scriptName) === 0) {
    $requestUri = substr($requestUri, strlen($scriptName));
}

// Remove leading/trailing slashes and split
$pathParts = explode('/', trim($requestUri, '/'));

// If URL starts with 'api', strip it
if (isset($pathParts[0]) && $pathParts[0] === 'api') {
    array_shift($pathParts);
}

$endpoint = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;
error_log("Request URI: $requestUri");
error_log("Script name: $scriptName");
error_log("Endpoint: $endpoint, ID: $id");

file_put_contents('debug.log', 
    "URI: $requestUri | Script: $scriptName | Endpoint: $endpoint | ID: $id\n", 
    FILE_APPEND);
try {
    switch($endpoint) {
        case 'comment':{
            handleComments($method, $id);
            break;
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}

function handleComments($method, $id){
    $commentModel = new Comment();

    switch($method){
        case 'GET': {
            if($id){
                $comments = $commentModel->getBillComments($id);
                echo json_encode($comments);
            } else {
                echo json_encode([]);
            }
        }
    }
}