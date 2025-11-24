async function deleteProtection(id) {
    if (!confirm("Segur que vols eliminar aquesta protecció?")) return;

    try {
        const res = await fetch(`/protection/delete/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la protecció");
    }
}

function filterProtections(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();
    cards.forEach(card => {
        const level = card.dataset.level.toLowerCase();
        const description = card.dataset.description.toLowerCase();
        if (level.includes(lower) || description.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}