<?php

session_start();

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
use billreview\backend\models\User;

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
        case 'bills' : {
            handleBills($method);
            break;
        }
        case 'comment' : {
            handleComments($method, $id);
            break;
        }  
        case 'users' : {
            handleUsers($method, $id);
            break;
        }
        case 'auth' : {
            handleAuth($method);
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

function handleBills($method){
    if ($method == 'GET'){
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
        require_once __DIR__ . '/../api/api.php';  // ← keep only this

        // remove include('api.php'); ← delete this line

        $congress = 20;
        $type = 'SB'; 
        $limit = $_GET['limit'] ?? 20;
        $offset = $_GET['offset'] ?? 0;
        $q = $_GET['q'] ?? '';

        $api = new API();

        if ($q) {
            $params = [
                "limit" => $limit,
                "congress" => $congress,
                "type" => $type,
                "subtype" => 'SB',
                "offset" => $offset,
                "q" => $q,
            ];
            $fullUrl = $api->getURLSearch() . "?" . http_build_query($params);
        } else {
            $params = [
                "limit" => $limit,
                "congress" => $congress,
                "type" => $type,    
                "offset" => $offset,
            ];
            $fullUrl = $api->getURL() . "?" . http_build_query($params);
        }

        $response = file_get_contents($fullUrl);
        echo $response;
    }
}

function handleComments($method, $id){
    $commentModel = new Comment();

    switch($method){
        case 'GET': {
            if($id){
                $comments = $commentModel->getBillCommentsWithUser($id);
                echo json_encode($comments);
            } else {
                echo json_encode([]);
            }
        }
        case 'POST': {
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['bill_id'], $data['user_id'], $data['comment']) ) {
                if (isset($SESSION['user_id'])){
                    $commentId = $commentModel->createComment([
                        'bill_id' => $data['bill_id'],
                        'user_id' => $data['user_id'],
                        'comment' => $data['comment'],
                        'date_posted' => date('Y-m-d H:i:s')
                    ]);

                    echo json_encode(['success' => true, 'comment_id' => $commentId]);
                } else {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'error' => 'Must be logged in to post a comment']);
                    return;
                }
            } 
            else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            }
        }
    }
}
function handleAuth($method) {
    $userModel = new User();

    switch($method) {
        case 'POST': {
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data['action'] === 'check-duplicate') {
                $exists = $userModel->checkDuplicate($data['field'], $data['value']);
                echo json_encode(['exists' => !empty($exists)]);
            }
            
            else if ($data['action'] === 'register') {
                try {
                    $userId = $userModel->createUser([
                        'username' => $data['username'],
                        'fname'    => $data['firstName'],
                        'lname'    => $data['lastName'],
                        'email'    => $data['email'],
                        'password' => $data['password'],
                        'usertype_id' => $data['occupation']
                    ]);
                    
                    http_response_code(201);
                    echo json_encode(['success' => true, 'user_id' => $userId]);
                } catch (Exception $e) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                }
            }

            if ($data['action'] === 'login') {
                $user = $userModel->login($data['username'], $data['password']);

                if ($user) {
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['fname'] = $user['fname'];

                    echo json_encode(['success' => true, 'user' => $user]);
                } else {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
                }
            }
            break;
        }
    }
}

function handleUsers($method, $id){ 
    $userModel = new User();

    switch($method){
        case 'GET': {
            if($id){
                $user = $userModel->getUserById($id);
                echo json_encode($user);
            } else {

            }
        }
        
        case 'POST': {
            $data = json_decode(file_get_contents('php://input'), true);
        }
    }
}