document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('main-form');
    AppUtils.initMultiSelect('typologies', 'Selecciona tipologies...');
    AppUtils.initMultiSelect('themes', 'Selecciona temàtiques...');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) data.selectedTypologies = [data.selectedTypologies];
        if (data.themes && !Array.isArray(data.themes)) data.themes = [data.themes];

        try {
            const res = await fetch(`/publications/edit/${publication.id_publication}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            await Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) {
                const savedFilters = sessionStorage.getItem('publications_filters') || '';
                window.location.href = "/publications" + savedFilters;
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al actualitzar la publicació' });
        }
    });
});