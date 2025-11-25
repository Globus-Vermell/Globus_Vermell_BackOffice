// Obtener el formulario de edición
const form = document.getElementById("form-edit-architect");

// Obtener los datos actuales del arquitecto desde un objeto global (definido en el EJS)
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Recogemos los datos del formulario
    const data = Object.fromEntries(new FormData(form).entries());

    try {
        // Realizar la solicitud PUT al servidor
        const res = await fetch(`/architects/edit/${architect.id_architect}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        
        // Procesar la respuesta del servidor
        const result = await res.json();
        alert(result.message);
        // Redirigir si la actualización fue exitosa
        if (result.success) window.location.href = "/architects";
    } catch (err) {
        console.error(err);
        alert("Error al actualizar el arquitecte");
    }
});
