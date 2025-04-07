function nextStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step${step}`).classList.remove('hidden');
  document.querySelectorAll('.step-active').forEach((s, i) => s.classList.toggle('bg-blue-600', i < step - 1));
}

function prevStep(step) {
  nextStep(step);
}

function toggleFamily(select) {
  const familyFields = document.getElementById('familyFields');
  familyFields.classList.toggle('hidden', select.value !== 'family');
}

function addKidFields(input) {
  const count = input.value;
  const kidDetails = document.getElementById('kidDetails');
  kidDetails.innerHTML = '';
  for (let i = 0; i < count; i++) {
    kidDetails.innerHTML += `
      <div class="space-y-2 mt-2">
        <input type="number" name="kid_age_${i}" placeholder="Kid ${i + 1} Age" class="w-full p-3 rounded bg-gray-700">
        <select name="kid_gender_${i}" class="w-full p-3 rounded bg-gray-700">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    `;
  }
}

document.getElementById('tripForm').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form submitted!');

  const formData = new FormData(e.target);
  console.log('Form Data:', Object.fromEntries(formData)); // Log form data for debugging

  fetch('http://localhost/ai-guide-assistant/php/generate-list.php', { 
    method: 'POST', 
    body: formData 
  })
  .then(res => {
    console.log('Response Status:', res.status);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    console.log('Response Data:', data);
    localStorage.setItem('packingList', JSON.stringify(data));
    console.log('Data saved to localStorage');
    window.location.href = 'packing-list.html';
  })
  .catch(error => {
    console.error('Fetch Error:', error);
    alert('Failed to generate packing list: ' + error.message + '. Check the console for details.');
  });
});