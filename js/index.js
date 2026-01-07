const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';
const SHEET_NAME = 'cartelera';
const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');

let tarjetas = []; // datos originales

// Renderiza tarjetas
function renderCards(lista) {
  cardsContainer.innerHTML = '';

  if (lista.length === 0) {
    cardsContainer.innerHTML = '<p>No se encontraron resultados</p>';
    return;
  }

  lista.forEach(item => {
    const link = document.createElement('a');
    link.href = 'pages/' + item.url;
    link.className = 'card-link';

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <i class="fa-solid ${item.icono}"></i>
      <h3>${item.nombre}</h3>
      <p>${item.descripcion}</p>
    `;

    link.appendChild(card);
    cardsContainer.appendChild(link);
  });
}


// Cargar datos
fetch(URL)
  .then(res => res.json())
  .then(data => {
    tarjetas = data.filter(item => item.activa === 'TRUE');

    // Cards iniciales
    renderCards(tarjetas);

    // Dropdown
    tarjetas.forEach(item => {
      const option = document.createElement('option');
      option.value = item.nombre;
      option.textContent = item.nombre;
    });
  })
  .catch(err => console.error(err));

// Buscador
searchInput.addEventListener('input', () => {
  const texto = searchInput.value.toLowerCase();

  const filtradas = tarjetas.filter(item =>
    item.nombre.toLowerCase().includes(texto) ||
    item.descripcion.toLowerCase().includes(texto)
  );

  renderCards(filtradas);
});