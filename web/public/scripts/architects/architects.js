// Función para eliminar un arquitecto
async function deleteArchitect(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquest arquitecte?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/architects/delete/${id}`, {
            method: "DELETE"
        });

        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        alert("Error al eliminar l'arquitecte");
    }
}

// Función para filtrar arquitectos
function filterArchitects(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const cards = document.querySelectorAll('.card');
    const s = searchTerm.toLowerCase();

    //Filtramos las cards por nombre o descripción para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const desc = card.dataset.description.toLowerCase();
        card.style.display = (name.includes(s) || desc.includes(s)) ? 'flex' : 'none';
    });
}