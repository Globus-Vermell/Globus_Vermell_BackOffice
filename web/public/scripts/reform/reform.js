async function deleteReform(id) {
    if (!confirm("Segur que vols eliminar aquesta reforma?")) return;

    try {
        const res = await fetch(`/reform/delete/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la reforma");
    }
}

function filterReforms(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();
    cards.forEach(card => {
        const year = card.dataset.year.toString();
        const architect = card.dataset.architect.toString().toLowerCase();
        if (year.includes(lower) || architect.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}