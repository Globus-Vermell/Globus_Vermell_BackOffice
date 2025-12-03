// Función para eliminar una tipología
async function deleteTypology(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta tipologia?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/typologies/delete/${id}`, {
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
function filterTypologies() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    window.location.href = `/typology?${params.toString()}`;
}