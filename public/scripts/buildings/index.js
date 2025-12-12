function filterBuildings() {
    const inputVal = document.getElementById('searchInput').value;

    const radioValidation = document.querySelector('input[name="filterValidation"]:checked');
    const valSelect = radioValidation ? radioValidation.value : 'all';

    const radioImage = document.querySelector('input[name="filterImage"]:checked');
    const imgSelect = radioImage ? radioImage.value : 'all';

    const pubSelect = document.getElementById('filterPublication').value;

    const params = new URLSearchParams();
    if (inputVal) params.set('search', inputVal);
    if (valSelect !== 'all') params.set('validated', valSelect);
    if (imgSelect !== 'all') params.set('image', imgSelect);
    if (pubSelect !== 'all') params.set('publication', pubSelect);

    params.set('page', 1);
    window.location.href = `/buildings?${params.toString()}`;
}
