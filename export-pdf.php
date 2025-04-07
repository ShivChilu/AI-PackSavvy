<?php
require 'vendor/autoload.php'; // Require Composer's autoloader

use Spipu\Html2Pdf\Html2Pdf;

header('Content-Type: application/json');

// Get the HTML content from POST request
$html = $_POST['html'] ?? '';

if (empty($html)) {
    echo json_encode(['error' => 'No HTML content provided']);
    exit;
}

try {
    // Create PDF
    $html2pdf = new Html2Pdf('P', 'A4', 'en', true, 'UTF-8', [10, 15, 10, 15]);
    $html2pdf->writeHTML($html);
    
    // Generate a unique filename
    $filename = 'packing-list-' . date('Ymd-His') . '.pdf';
    $filepath = '../data/exports/' . $filename;
    
    // Ensure directory exists
    if (!is_dir('../data/exports')) {
        mkdir('../data/exports', 0777, true);
    }
    
    // Save to file (optional)
    $html2pdf->output($filepath, 'F');
    
    // Get PDF content as string
    $pdfContent = $html2pdf->output('', 'S');
    
    // Return success with PDF data
    echo json_encode([
        'success' => true,
        'filename' => $filename,
        'pdf' => base64_encode($pdfContent)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'error' => 'PDF generation failed: ' . $e->getMessage()
    ]);
}
?>