// Función para eliminar una publicación
async function deletePublication(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta publicació?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/publications/delete/${id}`, {
            method: "DELETE"
        });

        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la publicació");
    }
}

// Función para filtrar publicaciones
function filterPublications(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    //Filtramos las cards por título o descripción para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const desc = (card.dataset.description || '').toLowerCase();

        if (title.includes(lower) || desc.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

