// Función para eliminar un premio
async function deletePrize(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquest premi?")) return;

    // Realizar la solicitud DELETE al servidor
    try {
        const res = await fetch(`/prizes/delete/${id}`, {
            method: "DELETE"
        });
        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar el premi");
    }
}
// Función para filtrar premios
function filterPrizes(searchTerm) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    //Filtramos las cards por nombre, año o tipo para ver si coinciden con el término de búsqueda
    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const year = (card.dataset.year || '').toString();
        const tipe = (card.dataset.tipe || '').toLowerCase();

        if (name.includes(lower) || year.includes(lower) || tipe.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}