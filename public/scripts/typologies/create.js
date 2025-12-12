document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-typology");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        try {
            const uploadResult = await AppUtils.uploadFiles("image", "/typologies/upload", "image");
            if (uploadResult && uploadResult.filePath) {
                data.image = uploadResult.filePath;
            }
        } catch (err) { return; }

        try {
            const res = await fetch("/typologies/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            await Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) form.reset();
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al enviar el formulari." });
        }
    });
});