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
function filterArchitects() {
    // 1. Obtenemos el valor del input
    const inputVal = document.getElementById('searchInput').value;
    
    // 2. Preparamos los parámetros de la URL
    const params = new URLSearchParams();
    
    if (inputVal) {
        params.set('search', inputVal);
    }
    
    // Volvemos siempre a la página 1 al buscar
    params.set('page', 1);

    // 3. Recargamos la página con la nueva búsqueda
    window.location.href = `/architects?${params.toString()}`;
}