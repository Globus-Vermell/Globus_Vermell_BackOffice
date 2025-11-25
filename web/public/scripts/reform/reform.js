// Función para eliminar una reforma
async function deleteReform(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta reforma?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/reform/delete/${id}`, { method: "DELETE" });
        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la reforma");
    }
}

// Función para filtrar reformas
function filterReforms(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();
    //Filtramos las cards por año o arquitecto para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const year = card.dataset.year.toString();
        const architect = card.dataset.architect.toString().toLowerCase();
        if (year.includes(lower) || architect.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}