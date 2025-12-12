// Función para filtrar usuarios
function filterUsers() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    params.set('page', 1); // Reset a página 1
    window.location.href = `/users?${params.toString()}`;
}