(() => {
  const SHEET_ID = '1HwjfPfP9xR0Eocc8lE0RCGqhjmDuu_F0rp8N_87JxRo';

  const URL_TARJETAS = `https://opensheet.elk.sh/${SHEET_ID}/tarjetas`;
  const URL_DEPTOS = `https://opensheet.elk.sh/${SHEET_ID}/departamentos`;
  const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

  const container = document.getElementById('edificiosContainer');
  const territoriosContainer = document.getElementById('territoriosContainer');
  const titulo = document.getElementById('titulo');

  if (!container || !territoriosContainer) return;

  // 🔹 Título dinámico
  fetch(URL_TITULOS)
    .then(r => r.json())
    .then(data => {
      const fila = data.find(f => f.seccion === 'edificios');
      if (fila && titulo) {
        titulo.innerHTML = `<i class="fa-solid fa-building"></i> ${fila.titulo}`;
      }
    });

  let tarjetas = [];
  let deptos = [];
  let territorioActivo = null;

  Promise.all([
    fetch(URL_TARJETAS).then(r => r.json()),
    fetch(URL_DEPTOS).then(r => r.json())
  ])
    .then(([t, d]) => {
      tarjetas = t;
      deptos = d;
      renderTerritorios();
    });

  // 🟦 Tarjetas de territorios
  function renderTerritorios() {
    const territorios = [...new Set(tarjetas.map(t => t.territorio))]
      .sort((a, b) => a - b);

    territoriosContainer.innerHTML = '';

    territorios.forEach((t, index) => {
      const card = document.createElement('div');
      card.className = 'territorio-card';
      card.textContent = `Territorio ${t}`;

      card.onclick = () => seleccionarTerritorio(t, card);

      territoriosContainer.appendChild(card);

      // 🔹 Seleccionar el primero automáticamente
      if (index === 0) {
        seleccionarTerritorio(t, card);
      }
    });
  }


  // 🟦 Render territorio
  function renderTerritorio(territorio) {
    container.innerHTML = '';

    tarjetas
      .filter(t => t.territorio === territorio)
      .forEach(tarjeta => {

        const card = document.createElement('div');
        card.className = 'tarjeta-edificio';

        card.innerHTML = `
          <h2>Manzana ${tarjeta.manzana} – Edificio ${tarjeta.edificio}</h2>
          <div><strong>Dirección:</strong> ${tarjeta.direccion}</div>
        `;

        const tabla = document.createElement('table');
        tabla.className = 'tabla-edificio';

        // 🔹 Deptos por tarjeta_id
        const deptosTarjeta = deptos.filter(d => d.tarjeta_id === tarjeta.tarjeta_id);

        // 🔹 Letras dinámicas
        const letras = [...new Set(deptosTarjeta.map(d => d.depto))].sort();

        // Header
        let header = '<tr><th>Piso</th>';
        letras.forEach(l => header += `<th>${l}</th>`);
        header += '</tr>';
        tabla.innerHTML = header;

        // Agrupar por piso
        const porPiso = {};
        deptosTarjeta.forEach(d => {
          if (!porPiso[d.piso]) porPiso[d.piso] = {};
          porPiso[d.piso][d.depto] = d.estado;
        });

        Object.keys(porPiso).forEach(piso => {
          let row = `<tr><td>${piso}</td>`;
          letras.forEach(l => {
            const estado = porPiso[piso][l] || '';
            const clase = estado ? `estado estado-${estado.toLowerCase().replace(/\s/g, '-')}` : '';
            row += `<td class="${clase}">${estado}</td>`;
          });
          row += '</tr>';
          tabla.innerHTML += row;
        });

        const tableWrap = document.createElement('div');
        tableWrap.className = 'tabla-wrap';
        tableWrap.appendChild(tabla);
        card.appendChild(tableWrap);

        container.appendChild(card);

        if (tarjeta.observaciones && tarjeta.observaciones !== '—') {
          const obs = document.createElement('div');
          obs.className = 'obs';
          obs.innerHTML = `<strong>Observaciones:</strong> ${tarjeta.observaciones}`;
          card.appendChild(obs);
        }
      });
  }
  function seleccionarTerritorio(territorio, cardSeleccionada) {
    territorioActivo = territorio;

    // 🔹 Quitar activo a todos
    document.querySelectorAll('.territorio-card')
      .forEach(c => c.classList.remove('activo'));

    // 🔹 Marcar el actual
    cardSeleccionada.classList.add('activo');

    // 🔹 Renderizar edificios
    renderTerritorio(territorio);
  }
})();

