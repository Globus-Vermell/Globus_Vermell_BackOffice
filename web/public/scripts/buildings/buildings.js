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

function filterBuildings() {
    const inputVal = document.getElementById('searchInput').value;
    const valSelect = document.getElementById('filterValidation').value;
    const imgSelect = document.getElementById('filterImage').value; // <--- Esto recogerá "true", "false" o "all"
    const pubSelect = document.getElementById('filterPublication').value;

    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    if (valSelect !== 'all') params.set('validated', valSelect);
    if (imgSelect !== 'all') params.set('image', imgSelect); // <--- Se envía al servidor
    if (pubSelect !== 'all') params.set('publication', pubSelect);
    
    params.set('page', 1);
    window.location.href = `/buildings?${params.toString()}`;
}

function resetFilters() {
    window.location.href = '/buildings';
}

// Función para validar una edificacion
async function validateBuilding(id) {
    if (!confirm("Segur que vols canviar l'estat de validació d'aquesta construcció?")) return;

    try {
        const res = await fetch(`/buildings/validation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validated: true })
        });

        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al validar la construcció");
    }
}