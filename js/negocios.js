(() => {
    const SHEET_ID = '1NDxtj4JdcpkumJEXrLWKR4zV5Ke7Vkp85L5Jmb2MpBg';

    const URL_PDF = `https://opensheet.elk.sh/${SHEET_ID}/urls`;
    const URL_TITULOS = `https://opensheet.elk.sh/${SHEET_ID}/titulos`;

    const container = document.getElementById('negociosContainer');
    const titulo = document.getElementById('tituloNegocios');

    if (!container) return;

    // 🔹 Título dinámico
    fetch(URL_TITULOS)
        .then(r => r.json())
        .then(data => {
            const fila = data.find(f => f.seccion === 'negocios');
            if (fila && titulo) {
                titulo.innerHTML = `<i class="fa-solid fa-store"></i> ${fila.titulo}`;
            }
        });

    // 🔹 Cargar PDF de negocios
    fetch(URL_PDF)
        .then(r => r.json())
        .then(data => {
            console.log('DATA PDF:', data);

            const fila = data.find(f => f.SECCION === 'negocios');
            console.log('FILA NEGOCIOS:', fila);

            const pdfUrl = fila?.PDF_URL;
            console.log('PDF URL:', pdfUrl);

            if (!pdfUrl) return;

            container.innerHTML = `
            <div class="negocio-card">
                <iframe src="${pdfUrl}" class="pdf-frame"></iframe>
            </div>
            `;
        })
        .catch(err => console.error(err));
})();
