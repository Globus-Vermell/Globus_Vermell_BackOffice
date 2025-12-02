// Función para eliminar una publicación
async function deletePublication(id) {
    if (!confirm("Segur que vols eliminar aquesta publicació?")) return;

    try {
        const res = await fetch(`/publications/delete/${id}`, { method: "DELETE" });
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
    if (!confirm("Segur que vols canviar l'estat de validació d'aquesta publicació?")) return;

    try {
        const res = await fetch(`/publications/validation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validated: true })
        });

        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al validar la publicació");
    }
}

// Función de filtrado
function filterPublications() {
    const inputVal = document.getElementById('searchInput').value.toLowerCase();
    const valSelect = document.getElementById('filterValidation').value;

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // 1. Filtro Texto (Usamos dataset.title que es lo que pusiste en el EJS)
        const title = (card.dataset.title || '').toLowerCase();
        const description = (card.dataset.description || '').toLowerCase();
        
        const matchesText = title.includes(inputVal) || description.includes(inputVal);

        // 2. Filtro Validación
        const isValidated = card.dataset.validated; 
        const matchesValidation = (valSelect === 'all') ? true : (isValidated === valSelect);

        // Mostrar u ocultar (¡Solo comprobamos Text y Validation!)
        if (matchesText && matchesValidation) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para reiniciar todo
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterValidation').value = 'all';
    filterPublications(); 
}