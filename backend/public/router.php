<?php
// Router for PHP built-in server
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Handle uploads directory
if (strpos($uri, '/uploads/') === 0) {
    $filePath = __DIR__ . '/..' . $uri;  // Go up one directory from public to backend
    
    if (file_exists($filePath) && is_file($filePath)) {
        // Get mime type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $filePath);
        finfo_close($finfo);
          // Set headers
        header("ngrok-skip-browser-warning: true");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, ngrok-skip-browser-warning");
        header("Content-Type: {$mimeType}");
        header("Content-Length: " . filesize($filePath));
        
        // For documents, set inline disposition to allow browser viewing
        $filename = basename($filePath);
        header("Content-Disposition: inline; filename=\"{$filename}\"");
        
        // Output file
        readfile($filePath);
        return;
    } else {
        http_response_code(404);
        echo "File not found";
        return;
    }
}

// For all other requests, use the main index.php
require_once 'index.php';
?>
