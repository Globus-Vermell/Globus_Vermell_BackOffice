// Función para eliminar una protección
async function deleteProtection(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta protecció?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/protection/delete/${id}`, { method: "DELETE" });
        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la protecció");
    }
}

// Función para filtrar protecciones
function filterProtections() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    
    if (inputVal) params.set('search', inputVal);
    
    window.location.href = `/protection?${params.toString()}`;
}