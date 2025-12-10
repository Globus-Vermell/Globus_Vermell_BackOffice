// Función para filtrar tipologías
function filterTypologies() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    window.location.href = `/typology?${params.toString()}`;
}