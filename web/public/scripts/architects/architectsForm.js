// Formulario de creación de arquitecto
document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el formulario
    const form = document.getElementById("form-arquitecte");

    // Agregamos el listener al formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Enviamos los datos al servidor
            const res = await fetch("/architects/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // Obtenemos el resultado
            const result = await res.json();
            alert(result.message);

            if (result.success) {
                form.reset();
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar el formulari.");
        }
    });
});