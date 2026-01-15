(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';
  const URL_GRUPOS  = `https://opensheet.elk.sh/${SHEET_ID}/grupos`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('gruposContainer');
  const titulo = document.getElementById('tituloGrupos');
  if (!container) return;

  fetch(URL_TITULOS)
    .then(res => res.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'grupos');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-users"></i> ${fila.titulo}`;
      }
    });

  fetch(URL_GRUPOS)
    .then(res => res.json())
    .then(data => renderGrupos(data))
    .catch(err => console.error(err));

  function renderGrupos(data) {
    container.innerHTML = '';

    const porGrupo = {};
    data.forEach(fila => {
      if (!porGrupo[fila.GRUPO]) porGrupo[fila.GRUPO] = [];
      porGrupo[fila.GRUPO].push(fila);
    });

    Object.keys(porGrupo).forEach(grupo => {
      const personas = porGrupo[grupo];

      const card = document.createElement('div');
      card.className = 'sonido-card';

      // Ordenar para que los roles aparezcan primero
      const rolesPrioritarios = ['SUP', 'AUX'];
      const personasOrdenadas = personas.sort((a, b) => {
        const aIndex = a.ROLES ? rolesPrioritarios.findIndex(r => a.ROLES.includes(r)) : 2;
        const bIndex = b.ROLES ? rolesPrioritarios.findIndex(r => b.ROLES.includes(r)) : 2;
        return aIndex - bIndex;
      });

      card.innerHTML = `
        <h2>${grupo} <span style="font-size:.85rem;color:#666">(${personas.length})</span></h2>
        <table class="sonido-table">
          <tbody>
            ${personasOrdenadas.map(p => `
              <tr>
                <td>
                  <span class="nombre-persona">${p.NOMBRE}</span>
                  ${formatRoles(p.ROLES)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      container.appendChild(card);
    });

    const total = data.length;
    const totalDiv = document.createElement('div');
    totalDiv.className = 'sonido-card';
    totalDiv.innerHTML = `
      <h2>Total</h2>
      <p style="text-align:center;font-size:1.2rem;font-weight:600">
        ${total}
      </p>
    `;
    container.appendChild(totalDiv);
  }

  function formatRoles(roles) {
    if (!roles) return '';
    const mostrar = ['SUP', 'AUX'];
    return roles
      .split(',')
      .map(r => r.trim())
      .filter(r => mostrar.includes(r))
      .map(r => `<span class="rol-badge">${r}</span>`)
      .join(' ');
  }
})();
