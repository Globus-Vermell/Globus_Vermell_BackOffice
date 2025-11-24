async function deletePrize(id) {

    if (!confirm("Segur que vols eliminar aquest premi?")) return;

    try {
        const res = await fetch(`/prizes/delete/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);

        if (data.success) location.reload();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar el premi");
    }
}
function filterPrizes(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const lower = searchTerm.toLowerCase();

    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const year = (card.dataset.year || '').toString();
        const tipe = (card.dataset.tipe || '').toLowerCase();

        if (name.includes(lower) || year.includes(lower) || tipe.includes(lower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}