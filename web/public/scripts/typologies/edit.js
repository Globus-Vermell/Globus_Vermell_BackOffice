const form = document.getElementById('form-typology-edit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obtenemos los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const uploadResult = await AppUtils.uploadFiles("image", "/typologies/upload", "image");
        if (uploadResult && uploadResult.filePath) {
            data.image = uploadResult.filePath;
        }
    } catch (err) {
        return;
    }

    // Actualizamos la tipología
    try {
        const res = await fetch(`/typologies/edit/${typology.id_typology}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // Obtenemos el resultado de la actualización
        const result = await res.json();
        alert(result.message);
        if (result.success) window.location.href = '/typologies';
    } catch (err) {
        console.error(err);
        alert('Error al actualizar la tipologia');
    }
});