function filterArchitects() {
    const inputVal = document.getElementById('searchInput').value;
    const params = new URLSearchParams();

    if (inputVal) {
        params.set('search', inputVal);
    }

    params.set('page', 1);
    window.location.href = `/architects?${params.toString()}`;
}