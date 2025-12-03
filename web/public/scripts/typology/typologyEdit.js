const form = document.getElementById('form-typology-edit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obtenemos los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Determinamos la URL de la imagen
    let imageUrl = typology.image;
    const imageFile = formData.get("image");

    // Si se ha seleccionado una imagen, la subimos
    if (imageFile && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        // Subimos la imagen
        try {
            const uploadRes = await fetch("/typologies/upload", {
                method: "POST",
                body: uploadData
            });
            // Obtenemos el resultado de la subida
            const uploadResult = await uploadRes.json();
            if (uploadResult.success) {
                imageUrl = uploadResult.filePath;
            } else {
                alert("Error al pujar la imatge.");
                return;
            }
        } catch (err) {
            console.error("Error connexió imatge:", err);
            alert("Error de connexió al pujar la imatge.");
            return;
        }
    }
    // Actualizamos la imagen
    data.image = imageUrl;

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