// Función para filtrar protecciones
function filterProtections() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();

    if (inputVal) params.set('search', inputVal);

    window.location.href = `/protections?${params.toString()}`;
}