async function deleteBuilding(id) {
    if (!confirm("Segur que vols eliminar aquest edifici?")) return;

    try {
        const res = await fetch(`/buildings/delete/${id}`, {
            method: "DELETE"
        });

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
    const lowerCaseSearchTerm = searchTerm;

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase() || ''; // Añade fallback para evitar errores si no existe
        const description = card.dataset.description.toLowerCase() || ''; // Añade fallback para evitar errores si no existe

        if (name.includes(lowerCaseSearchTerm) || description.includes(lowerCaseSearchTerm)) {
            card.style.display = 'flex'; // O 'block' si no es flex
        } else {
            card.style.display = 'none';
        }
    });
}