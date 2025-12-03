// Formulario de creación de reforma
document.addEventListener("DOMContentLoaded", async () => {
    // Obtenemos el formulario y el select de arquitectos
    const form = document.getElementById("form-reform");
    const selectArchitects = document.getElementById("id_architect");

    // Obtenemos los arquitectos
    const resArq = await fetch("/reforms/create/architects");
    const architects = await resArq.json();
    architects.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id_architect;
        opt.textContent = a.name;
        selectArchitects.appendChild(opt);
    });

    // Agregamos el listener al formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Obtenemos los datos del formulario
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            // Enviamos los datos al servidor
            const res = await fetch("/reforms/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // Obtenemos la respuesta del servidor
            const result = await res.json();
            alert(result.message);
            if (result.success) form.reset();
        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar el formulari.");
        }
    });
});