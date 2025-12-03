// Función para eliminar una reforma
async function deleteReform(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta reforma?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/reforms/delete/${id}`, { method: "DELETE" });
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
function filterReforms() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    
    if (inputVal) params.set('search', inputVal);
    params.set('page', 1); // Reset a página 1

    window.location.href = `/reforms?${params.toString()}`; 
}