(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const urls = {
    base: `https://opensheet.elk.sh/${SHEET_ID}/vida_ministerio`,
    tesoros: `https://opensheet.elk.sh/${SHEET_ID}/TESOROS_DE_LA_BIBLIA`,
    maestros: `https://opensheet.elk.sh/${SHEET_ID}/SEAMOS_MEJORES_MAESTROS`,
    vida: `https://opensheet.elk.sh/${SHEET_ID}/NUESTRA_VIDA_CRISTIANA`,
    finde: `https://opensheet.elk.sh/${SHEET_ID}/FIN_SEMANA`
  };

  const container = document.getElementById('vidaMinisterioContainer');
  const selector = document.getElementById('semanaSelector');
  if (!container || !selector) return;

  let DATA = {};

  Promise.all(Object.entries(urls).map(([k, u]) =>
    fetch(u).then(r => r.json()).then(d => DATA[k] = d)
  )).then(init);

  function init() {
    const semanas = [...new Set(DATA.base.map(x => x.SEMANA))];
    crearBotones(semanas);
    renderSemana(semanas[0]); // primera por defecto
  }

  function crearBotones(semanas) {
    selector.innerHTML = '';
    semanas.forEach(semana => {
      const btn = document.createElement('button');
      btn.textContent = semana;
      btn.onclick = () => renderSemana(semana);
      selector.appendChild(btn);
    });
  }

  function renderSemana(semana) {
    [...selector.children].forEach(b =>
      b.classList.toggle('active', b.textContent === semana)
    );

    const info = DATA.base.find(b => b.SEMANA === semana);
    if (!info) return;

    container.innerHTML = `
      <div class="sonido-card">
        <h2>Semana ${semana}</h2>
        <p><strong>Presidente:</strong> ${info.PRESIDENTE}</p>
        <p><strong>Canción:</strong> ${info.CANCION} – <strong>Oración:</strong> ${info.ORACION_INICIAL}</p>

        ${renderBloque('TESOROS DE LA BIBLIA', DATA.tesoros, semana)}
        ${renderBloque('SEAMOS MEJORES MAESTROS', DATA.maestros, semana, true)}
        ${renderBloque('NUESTRA VIDA CRISTIANA', DATA.vida, semana)}
        ${renderFinSemana(DATA.finde, semana)}
      </div>
    `;
  }

  function renderBloque(titulo, data, semana, ayudante = false) {
    const filas = data.filter(f => f.SEMANA === semana);
    if (!filas.length) return '';

    return `
      <h3 style="margin-top:20px">${titulo}</h3>
      <table class="sonido-table">
        <tbody>
          ${filas.map(f => `
            <tr>
              <td>${f.TITULO}</td>
              <td>${f.LECTOR || '—'}</td>
              ${ayudante ? `<td>${f.REEMPLAZANTE || '—'}</td>` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderFinSemana(data, semana) {
    const f = data.find(x => x.SEMANA === semana);
    if (!f) return '';

    return `
      <h3 style="margin-top:20px">Reunión Fin de Semana</h3>
      <table class="sonido-table">
        <tr><td>Fecha</td><td>${f.FECHA}</td></tr>
        <tr><td>Presidente</td><td>${f.PRESIDENTE}</td></tr>
        <tr><td>Lectura Atalaya</td><td>${f.LECTURA_ATALAYA}</td></tr>
      </table>
    `;
  }
})();
