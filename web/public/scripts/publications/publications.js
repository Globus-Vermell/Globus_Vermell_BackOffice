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
    const inputVal = document.getElementById('searchInput').value;
    const valSelect = document.getElementById('filterValidation').value;

    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    if (valSelect !== 'all') params.set('validated', valSelect);
    
    params.set('page', 1);
    window.location.href = `/publications?${params.toString()}`;
}