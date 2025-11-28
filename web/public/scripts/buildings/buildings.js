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

// Función de filtrado combinada (Texto + Validación + Publicación)
function filterBuildings() {
    const inputVal = document.getElementById('searchInput').value.toLowerCase();
    const valSelect = document.getElementById('filterValidation').value;
    const pubSelect = document.getElementById('filterPublication').value;
    const imgSelect = document.getElementById('filterImage').value;

    const cards = document.querySelectorAll('.card');
    

    cards.forEach(card => {
        // 1. Texto
        const name = card.dataset.name.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        const matchesText = name.includes(inputVal) || description.includes(inputVal);

        // 2. Validación
        const isValidated = card.dataset.validated; 
        let matchesValidation = (valSelect === 'all') ? true : (isValidated === valSelect);

        // 3 Imagen
        const hasImage = card.querySelector('.card-image') !== null;
        let matchesImage = false;

        if (imgSelect === 'all') {
            matchesImage = true;
        } else if (imgSelect === 'true') {
            matchesImage = hasImage;
        } else {
            matchesImage = !hasImage;
        }

        if (!matchesImage) {
            matchesValidation = false;
        }

        // 3. Publicación
        const cardPubId = card.dataset.publication; // Leemos el ID guardado en la tarjeta
        let matchesPublication = false;

        if (pubSelect === 'all') {
            matchesPublication = true;
        } else {
            // Comparamos el ID seleccionado con el ID de la tarjeta
            matchesPublication = (cardPubId == pubSelect); 
        }

        // Mostrar u ocultar
        if (matchesText && matchesValidation && matchesPublication) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}