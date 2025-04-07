function generatePreview(formData) {
    const packingList = {
      clothes: [],
      toiletries: ['toothbrush', 'toothpaste'],
      electronics: ['phone charger'],
      documents: ['passport'],
      health: ['first aid kit'],
      kids: []
    };
  
    const gender = formData.get('gender');
    const wear_type = formData.get('wear_type');
    if (gender === 'female') {
      packingList.clothes.push(wear_type === 'traditional' ? 'kurti' : 'dress');
    } else if (gender === 'male') {
      packingList.clothes.push(wear_type === 'casual' ? 't-shirt' : 'shirt');
    }
  
    return packingList;
  }
  
  // Example usage in trip-form.html (optional)
  document.getElementById('tripForm')?.addEventListener('input', (e) => {
    const formData = new FormData(e.target);
    const preview = generatePreview(formData);
    console.log(preview); // For debugging
  });