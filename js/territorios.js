(() => {
  const SHEET_ID = '1NDxtj4JdcpkumJEXrLWKR4zV5Ke7Vkp85L5Jmb2MpBg';

  const URL_TERRITORIO = `https://opensheet.elk.sh/${SHEET_ID}/urls`;
  const URL_TITULOS    = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('territorioContainer');
  const titulo = document.getElementById('tituloTerritorio');

  if (!container) return;

  // 👉 título desde hoja "titulos"
  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'territorios');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${fila.titulo}`;
      }
    });

  // 👉 cargar PDF
  fetch(URL_TERRITORIO)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return;

      const pdfUrl = data[1].PDF_URL;

      container.innerHTML = `
        <div class="territorio-card">
          <iframe 
            src="${pdfUrl}" 
            class="pdf-frame"
            loading="lazy">
          </iframe>
        </div>
      `;
    })
    .catch(err => console.error(err));
})();
