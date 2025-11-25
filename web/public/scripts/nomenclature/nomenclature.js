// Función para eliminar una nomenclatura
async function deleteNomenclature(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta nomenclatura?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/nomenclature/delete/${id}`, {
            method: "DELETE"
        });
        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la nomenclatura");
    }
}

// Función para filtrar nomenclaturas
function filterNomenclature(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const cards = document.querySelectorAll('.card');
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    //Filtramos las cards por nombre o descripción para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        if (name.includes(lowerCaseSearchTerm) || description.includes(lowerCaseSearchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}