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

// Función de filtrado combinada (Texto + Validación)
function filterBuildings() {
    // 1. Obtenemos los valores actuales del input y del select
    const inputVal = document.getElementById('searchInput').value.toLowerCase();
    const selectVal = document.getElementById('filterValidation').value; // 'all', 'true', 'false'
    
    // 2. Seleccionamos todas las tarjetas
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // --- Comprobación de TEXTO ---
        const name = card.dataset.name.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        // Verifica si el nombre o descripción contiene el texto escrito
        const matchesText = name.includes(inputVal) || description.includes(inputVal);

        // --- Comprobación de VALIDACIÓN ---
        const isBuildingValidated = card.dataset.validated; // Esto devuelve el string "true" o "false"
        
        let matchesStatus = false;
        if (selectVal === 'all') {
            matchesStatus = true; // Si es all, todos valen
        } else {
            // Comparamos si el valor del select coincide con el del atributo data
            matchesStatus = (isBuildingValidated === selectVal);
        }

        // --- Resultado Final ---
        // Solo mostramos la tarjeta si CUMPLE AMBAS condiciones
        if (matchesText && matchesStatus) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}