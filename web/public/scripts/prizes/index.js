// Función para filtrar premios
function filterPrizes() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();

    if (inputVal) params.set('search', inputVal);

    window.location.href = `/prizes?${params.toString()}`;
}