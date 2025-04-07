// Pulse glow effect for buttons
document.querySelectorAll('.glow').forEach(button => {
    button.addEventListener('mouseover', () => {
      button.style.animation = 'pulseGlow 1.5s infinite';
    });
    button.addEventListener('mouseout', () => {
      button.style.animation = '';
    });
  });
  
  // Define the keyframes dynamically
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7); }
      50% { box-shadow: 0 0 25px rgba(59, 130, 246, 1); }
      100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7); }
    }
  `;
  document.head.appendChild(styleSheet);
  
  // Fade-in effect for page load
  document.body.style.opacity = 0;
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 1s ease-in';
    document.body.style.opacity = 1;
  });