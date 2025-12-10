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