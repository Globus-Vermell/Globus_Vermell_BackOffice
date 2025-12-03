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
function filterPrizes() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();
    
    if (inputVal) params.set('search', inputVal);
    
    window.location.href = `/prizes?${params.toString()}`;
}