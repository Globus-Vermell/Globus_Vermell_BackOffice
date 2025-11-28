// Función para eliminar una publicación
async function deletePublication(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquesta publicació?")) return;

    try {
        // Realizar la solicitud DELETE al servidor
        const res = await fetch(`/publications/delete/${id}`, {
            method: "DELETE"
        });

        // Procesar la respuesta del servidor
        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la publicació");
    }
}

// Función para validar una publicación
async function validatePublication(id) {
    // Confirmar el cambio de validación
    if (!confirm("Segur que vols canviar l'estat de validació d'aquesta publicació?")) return;

    try {
        // Realizar la solicitud UPDATE al servidor
        const res = await fetch(`/publications/validation/${id}`, {
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
        alert("Error al validar la publicació");
    }
}

// Función de filtrado combinada (Texto + Validación + Publicación)
function filterPublications() {
    const inputVal = document.getElementById('searchInput').value.toLowerCase();
    const valSelect = document.getElementById('filterValidation').value;

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // 1. Texto
        const title = card.dataset.title.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        const matchesText = title.includes(inputVal) || description.includes(inputVal);

        // 2. Validación
        const isValidated = card.dataset.validated; 
        let matchesValidation = (valSelect === 'all') ? true : (isValidated === valSelect);

        // Mostrar u ocultar
        if (matchesText && matchesValidation ) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
