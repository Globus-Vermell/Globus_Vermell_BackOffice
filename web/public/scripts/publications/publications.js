async function deletePublication(id) {
    if (!confirm("Segur que vols eliminar aquesta publicació?")) return;

    try {
        const res = await fetch(`/publications/delete/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la publicació");
    }
}
function filterPublications(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const desc = (card.dataset.description || '').toLowerCase();

        if (title.includes(lower) || desc.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

