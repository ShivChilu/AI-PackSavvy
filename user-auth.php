<?php
header('Content-Type: application/json');

// Simple file-based authentication (for demo purposes)
// In production, use a proper database and password hashing

$dataFile = '../data/users.json';

// Ensure directory exists
if (!is_dir('../data')) {
    mkdir('../data', 0777, true);
}

// Initialize users file if it doesn't exist
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        'users' => [
            [
                'id' => 1,
                'email' => 'demo@packsvy.com',
                'password' => password_hash('demo123', PASSWORD_DEFAULT), // Hashed password
                'name' => 'Demo User'
            ]
        ]
    ]));
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($requestMethod === 'POST') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }
    
    $usersData = json_decode(file_get_contents($dataFile), true);
    $user = null;
    
    // Find user by email
    foreach ($usersData['users'] as $u) {
        if ($u['email'] === $email) {
            $user = $u;
            break;
        }
    }
    
    if ($user && password_verify($password, $user['password'])) {
        // Create a simple token (in production, use JWT or similar)
        $token = base64_encode(json_encode([
            'id' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + (7 * 24 * 60 * 60) // 1 week expiration
        ]));
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>