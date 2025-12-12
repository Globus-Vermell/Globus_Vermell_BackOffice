document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form-typology-edit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        try {
            const uploadResult = await AppUtils.uploadFiles("image", "/typologies/upload", "image");
            if (uploadResult && uploadResult.filePath) {
                data.image = uploadResult.filePath;
            } else {
                delete data.image;
            }
        } catch (err) { return; }

        try {
            const res = await fetch(`/typologies/edit/${typology.id_typology}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            await Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) window.location.href = '/typologies';
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al actualitzar la tipologia' });
        }
    });
});