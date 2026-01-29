(() => {
  const SHEET_ID = '1NDxtj4JdcpkumJEXrLWKR4zV5Ke7Vkp85L5Jmb2MpBg';

  const URL_SALIDAS = `https://opensheet.elk.sh/${SHEET_ID}/predicacion`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('predicacionContainer');
  const titulo = document.getElementById('tituloPredicacion');

  if (!container) return;

  // 👉 Cargar título
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'predicacion');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-microphone"></i> ${fila.titulo}`;
      }
    })
    .catch(err => console.error(err));

  // 👉 Cargar salidas
  fetch(URL_SALIDAS)
    .then(res => res.json())
    .then(data => renderPredicacion(data))
    .catch(err => console.error(err));

  function renderPredicacion(data) {
    container.innerHTML = '';

    const porDia = {};

    data.forEach(fila => {
      if (!porDia[fila.DIA]) porDia[fila.DIA] = [];
      porDia[fila.DIA].push(fila);
    });

    Object.keys(porDia).forEach(dia => {
      const card = document.createElement('div');
      card.className = 'dia-card';
      card.innerHTML = `<h2>${dia}</h2>`;

      porDia[dia].forEach(salida => {
        const div = document.createElement('div');
        div.className = 'salida';

        div.innerHTML = `
          <span class="hora"><i class="fa-regular fa-clock"></i> ${salida.HORA}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${salida.LUGAR}</span>
          <span><i class="fa-solid fa-user"></i> ${salida.CONDUCTOR || '—'}</span>
          <span><i class="fa-solid fa-map"></i> Territorio: ${salida.TERRITORIO}</span>
        `;

        card.appendChild(div);
      });

      container.appendChild(card);
    });
  }
})();
