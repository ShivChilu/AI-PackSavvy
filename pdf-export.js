/**
 * Enhanced PDF Export Functionality
 * Handles all PDF generation with proper styling and layout
 */

// PDF configuration
const pdfConfig = {
    margin: 10,
    filename: 'packing-list.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      hotfixes: ["px_scaling"]
    }
  };
  
  /**
   * Prepares HTML content for PDF export
   */
  function preparePDFContent(packingData) {
    const dateString = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    // Create PDF content container
    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';
    
    // Add PDF-specific styles
    const styles = document.createElement('style');
    styles.textContent = `
      .pdf-container {
        font-family: 'Arial', sans-serif;
        color: #333;
        padding: 20px;
        max-width: 100%;
      }
      .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #3b82f6;
      }
      .pdf-title {
        font-size: 24px;
        font-weight: bold;
        color: #3b82f6;
      }
      .pdf-date {
        font-size: 14px;
        color: #666;
      }
      .pdf-logo {
        height: 50px;
      }
      .pdf-category {
        margin-bottom: 15px;
        page-break-inside: avoid;
      }
      .pdf-category-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #3b82f6;
        border-bottom: 1px solid #ddd;
        padding-bottom: 3px;
      }
      .pdf-items {
        margin-left: 15px;
      }
      .pdf-item {
        margin-bottom: 5px;
        font-size: 14px;
      }
      .pdf-weather {
        margin-bottom: 20px;
        padding: 10px;
        background-color: #f8fafc;
        border-radius: 5px;
        border-left: 4px solid #3b82f6;
      }
      .pdf-weather-title {
        font-weight: bold;
        margin-bottom: 8px;
      }
      .pdf-weather-days {
        display: flex;
        overflow-x: auto;
        gap: 10px;
        padding-bottom: 10px;
      }
      .pdf-weather-day {
        min-width: 80px;
        text-align: center;
        padding: 8px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .pdf-tips {
        margin-top: 20px;
        padding: 15px;
        background-color: #f0fdf4;
        border-radius: 5px;
        border-left: 4px solid #10b981;
      }
      .pdf-tips-title {
        font-weight: bold;
        margin-bottom: 8px;
        color: #10b981;
      }
      .pdf-tip {
        margin-bottom: 5px;
        display: flex;
        align-items: flex-start;
      }
      .pdf-tip-bullet {
        margin-right: 8px;
        color: #10b981;
        font-weight: bold;
      }
      .pdf-footer {
        margin-top: 30px;
        padding-top: 10px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
      @media print {
        body, .pdf-container {
          background-color: white !important;
          color: black !important;
        }
      }
    `;
    pdfContainer.appendChild(styles);
  
    // Add header
    const header = document.createElement('div');
    header.className = 'pdf-header';
    header.innerHTML = `
      <div>
        <div class="pdf-title">PackSavvy Packing List</div>
        <div class="pdf-date">Generated on ${dateString}</div>
      </div>
      <img src="${window.location.origin}/assets/icons/suitcase.svg" class="pdf-logo">
    `;
    pdfContainer.appendChild(header);
  
    // Add trip summary
    if (packingData.tripDetails) {
      const summary = document.createElement('div');
      summary.className = 'pdf-summary';
      summary.innerHTML = `
        <div><strong>Destination:</strong> ${packingData.tripDetails.destination}</div>
        <div><strong>Duration:</strong> ${packingData.tripDetails.duration} day${packingData.tripDetails.duration > 1 ? 's' : ''}</div>
        <div><strong>Travelers:</strong> ${packingData.tripDetails.travelers}</div>
        <div><strong>Recommended Bag:</strong> ${packingData.bag || 'Not specified'}</div>
      `;
      pdfContainer.appendChild(summary);
    }
  
    // Add weather forecast if available
    if (packingData.weather && packingData.weather.length > 0) {
      const weatherSection = document.createElement('div');
      weatherSection.className = 'pdf-weather';
      weatherSection.innerHTML = `
        <div class="pdf-weather-title">Weather Forecast</div>
        <div class="pdf-weather-days">
          ${packingData.weather.map(day => `
            <div class="pdf-weather-day">
              <div style="font-weight:500;">${new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
              <div style="font-size:12px;margin:5px 0;">${day.condition.toLowerCase()}</div>
              <div style="font-size:18px;font-weight:bold;">${Math.round(day.temp)}°C</div>
            </div>
          `).join('')}
        </div>
      `;
      pdfContainer.appendChild(weatherSection);
    }
  
    // Add packing list categories
    for (const [category, items] of Object.entries(packingData.list)) {
      if (items && items.length > 0) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'pdf-category';
        categoryDiv.innerHTML = `
          <div class="pdf-category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
          <div class="pdf-items">
            ${items.map(item => `<div class="pdf-item">• ${item}</div>`).join('')}
          </div>
        `;
        pdfContainer.appendChild(categoryDiv);
      }
    }
  
    // Add tips if available
    if (packingData.tips && packingData.tips.length > 0) {
      const tipsSection = document.createElement('div');
      tipsSection.className = 'pdf-tips';
      tipsSection.innerHTML = `
        <div class="pdf-tips-title">Packing Tips</div>
        ${packingData.tips.map(tip => `
          <div class="pdf-tip">
            <span class="pdf-tip-bullet">•</span>
            <span>${tip}</span>
          </div>
        `).join('')}
      `;
      pdfContainer.appendChild(tipsSection);
    }
  
    // Add footer
    const footer = document.createElement('div');
    footer.className = 'pdf-footer';
    footer.textContent = 'Generated by PackSavvy - Your Smart Packing Assistant';
    pdfContainer.appendChild(footer);
  
    return pdfContainer;
  }
  
  /**
   * Exports the packing list as PDF
   */
  export function exportPackingListPDF(packingData) {
    return new Promise((resolve, reject) => {
      try {
        // Show loading indicator
        const loading = document.createElement('div');
        loading.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
        loading.innerHTML = `
          <div class="bg-gray-800 rounded-lg p-6 max-w-sm text-center">
            <div class="flex justify-center mb-4">
              <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">Generating PDF</h3>
            <p class="text-blue-100">Your packing list is being prepared for download...</p>
          </div>
        `;
        document.body.appendChild(loading);
  
        // Prepare content
        const element = preparePDFContent(packingData);
        document.body.appendChild(element);
  
        // Generate PDF
        html2pdf()
          .set(pdfConfig)
          .from(element)
          .toPdf()
          .get('pdf')
          .then(pdf => {
            // Add page numbers
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              pdf.text(
                `Page ${i} of ${totalPages}`,
                pdf.internal.pageSize.getWidth() - 30,
                pdf.internal.pageSize.getHeight() - 10
              );
            }
          })
          .save()
          .then(() => {
            document.body.removeChild(element);
            document.body.removeChild(loading);
            resolve();
          })
          .catch(err => {
            document.body.removeChild(element);
            document.body.removeChild(loading);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
  
  /**
   * Handles PDF export button click
   */
  export function setupPDFExportButton(buttonId, packingData) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        exportPackingListPDF(packingData)
          .catch(err => {
            console.error('PDF export error:', err);
            alert('Failed to generate PDF. Please try again.');
          });
      });
    }
  }