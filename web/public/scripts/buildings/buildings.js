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

/* --- Lógica del Dropdown Visual --- */

// Abrir/Cerrar el menú principal
function toggleDropdown() {
    const menu = document.getElementById('multi-dropdown');
    menu.classList.toggle('show');
}

// Cerrar el menú si se hace clic fuera
window.onclick = function(event) {
    if (!event.target.closest('.dropdown-btn') && !event.target.closest('.dropdown-menu')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Función mágica para aplicar filtros desde el menú
function setFilter(filterId, value) {
    // 1. Actualizamos el input oculto (que sustituye al select antiguo)
    document.getElementById(filterId).value = value;
    
    // 2. Llamamos a tu función de filtrado original
    filterBuildings(); 
    
    // 3. (Opcional) Cerramos el menú
    // toggleDropdown(); 
    
    console.log(`Filtro ${filterId} actualizado a: ${value}`);
}

// Función para reiniciar todo
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterValidation').value = 'all';
    document.getElementById('filterImage').value = 'all';
    document.getElementById('filterPublication').value = 'all';
    filterBuildings(); // Refrescar la lista
}

// Función para validar una edificacion
async function validateBuilding(id) {
    // Confirmar el cambio de validación
    if (!confirm("Segur que vols canviar l'estat de validació d'aquesta construcció?")) return;

    try {
        // Realizar la solicitud UPDATE al servidor
        const res = await fetch(`/buildings/validation/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ validated: true })
        });
        console.log(res);

        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al validar la construcció");
    }
}