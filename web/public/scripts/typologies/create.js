document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el formulario
    const form = document.getElementById("form-typology");

    // Agregamos el listener al formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const uploadResult = await AppUtils.uploadFiles("image", "/typologies/upload", "image");
            if (uploadResult) {
                if (uploadResult.filePath) {
                    data.image = uploadResult.filePath;
                }
            }
        } catch (err) {
            return;
        }

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