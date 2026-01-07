(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';
  const SHEET_NAME = 'cartelera';
  const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

  const menuSelect = document.getElementById('menuSecciones');
  if (!menuSelect) return;

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const secciones = data.filter(item => item.activa === 'TRUE');

      secciones.forEach(item => {
        const option = document.createElement('option');
        option.value = item.url;
        option.textContent = item.nombre;
        menuSelect.appendChild(option);
      });
    })
    .catch(err => console.error(err));

  menuSelect.addEventListener('change', () => {
    if (menuSelect.value) {
      window.location.href = '../pages/' + menuSelect.value;
    }
  });
})();
