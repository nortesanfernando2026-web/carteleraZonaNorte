(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_SONIDO  = `https://opensheet.elk.sh/${SHEET_ID}/sonido`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('sonidoContainer');
  const titulo = document.getElementById('tituloSonido');

  if (!container) return;

  // 👉 Cargar título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'sonido');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-microphone"></i> ${fila.titulo}`;
      }
    })
    .catch(err => console.error(err));

  // 👉 Cargar datos de sonido
  fetch(URL_SONIDO)
    .then(res => res.json())
    .then(data => renderSonido(data))
    .catch(err => console.error(err));

  function renderSonido(data) {
    container.innerHTML = '';

    const porFecha = {};

    data.forEach(fila => {
      if (!porFecha[fila.FECHA]) porFecha[fila.FECHA] = [];
      porFecha[fila.FECHA].push(fila);
    });

    Object.keys(porFecha).forEach(fecha => {
      const card = document.createElement('div');
      card.className = 'sonido-card';

      card.innerHTML = `
        <h2>${fecha}</h2>
        <table class="sonido-table">
          <thead>
            <tr>
              <th>🎬 Multimedia</th>
              <th>📺 Plataforma</th>
              <th>🎤 Micrófonos</th>
            </tr>
          </thead>
          <tbody>
            ${porFecha[fecha].map(f => `
              <tr>
                <td>${f.MULTIMEDIA || '—'}</td>
                <td>${f.PLATAFORMA || '—'}</td>
                <td>${f.MICROFONOS || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });
  }
})();
