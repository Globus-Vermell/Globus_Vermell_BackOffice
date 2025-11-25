// Función para eliminar una tipología
async function deleteTypology(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta tipologia?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/typology/delete/${id}`, {
            method: "DELETE"
        });

        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la tipologia");
    }
}

// Función para filtrar tipologías
function filterTypologies(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    //Filtramos las cards por nombre para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();

        if (name.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}