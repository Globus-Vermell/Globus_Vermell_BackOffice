// Función para eliminar un edificio
async function deleteBuilding(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquest edifici?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/buildings/delete/${id}`, {
            method: "DELETE"
        });
        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar l'edifici");
    }
}

// Función de filtrado para la barra de búsqueda
function filterBuildings(searchTerm) {
    const cards = document.querySelectorAll('.card'); // Usa la clase de la tarjeta
    const s = searchTerm.toLowerCase();

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        card.style.display = (name.includes(s) || description.includes(s)) ? 'flex' : 'none';


    });
}