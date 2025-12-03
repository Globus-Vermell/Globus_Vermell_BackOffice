document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el formulario
    const form = document.getElementById("form-typology");

    // Agregamos el listener al formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Variable para guardar la ruta de la imagen
        let imageUrl = "";
        const imageFile = formData.get("image");

        // Subimos la imagen si se ha seleccionado una
        if (imageFile && imageFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append("image", imageFile);

            try {
                // Subimos la imagen
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
                console.error("Error upload:", err);
                alert("Error de connexió al pujar imatge.");
                return;
            }
        }
        // Asignamos la ruta de la imagen a los datos a enviar
        data.image = imageUrl;

        try {
            // Enviamos los datos al servidor
            const res = await fetch("/typologies/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);

            if (result.success) form.reset();
        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar el formulari.");
        }
    });
});