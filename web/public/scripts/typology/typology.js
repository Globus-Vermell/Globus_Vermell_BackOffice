async function deleteTypology(id) {
    if (!confirm("Segur que vols eliminar aquesta tipologia?")) return;

    try {
        const res = await fetch(`/typology/delete/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la tipologia");
    }
}
function filterTypologies(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();

        if (name.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}