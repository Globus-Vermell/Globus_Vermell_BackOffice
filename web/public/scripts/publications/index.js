async function deletePublication(id) {
    await AppUtils.confirmAndDelete(
        `/publications/delete/${id}`,
        "Segur que vols eliminar aquesta publicació?"
    );
}

async function validatePublication(id) {
    await AppUtils.validateItem(`/publications/validation/${id}`, "Segur que vols canviar l'estat de validació d'aquesta publicació?");
}

function filterPublications() {
    const inputVal = document.getElementById('searchInput').value;

    const radioChecked = document.querySelector('input[name="filterValidation"]:checked');
    const valSelect = radioChecked ? radioChecked.value : 'all';

    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    if (valSelect !== 'all') params.set('validated', valSelect);

    params.set('page', 1);
    window.location.href = `/publications?${params.toString()}`;
}