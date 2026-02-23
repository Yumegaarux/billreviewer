<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include('api.php');

$congress = 20; // 20TH CONGRESS OF SENATE BILLS ONLY.
$type = 'SB'; 

$limit = $_GET['limit'] ?? 20; // how many items to retrieve. 
$offset = $_GET['offset'] ?? 0; // marks where to start the fetching of documents
$title = $_GET['title'] ?? '';
$q = $_GET['q'] ?? '';

$api = new API();

if ($q) {
    $params = [
        "limit" => $limit,
        "congress" => $congress,
        "type" => $type,
        "subtype" => 'SB', // added subtype because API sometimes return old data that uses subtype instead of type.
        "offset" => $offset,
        "q" => $q,
    ];

    $fullUrl = $api->getURLSearch() . "?" . http_build_query($params);
    $response = file_get_contents($fullUrl);
    echo $response;

} else {
    $params = [
        "limit" => $limit,
        "congress" => $congress,
        "type" => $type,    
        "offset" => $offset,
    ];
    $fullUrl = $api->getURL() . "?" . http_build_query($params);
    $response = file_get_contents($fullUrl);
    echo $response;

}


