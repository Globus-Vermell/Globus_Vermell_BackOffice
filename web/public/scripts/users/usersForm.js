// Formulario de creación de usuario
document.addEventListener("DOMContentLoaded", () => {
    // Guardamos el formulario en una constante
    const form = document.getElementById("form-user");
    // Añadimos un listener al formulario para el evento submit
    form.addEventListener("submit", async e => {
        e.preventDefault();
        // Obtenemos los datos del formulario
        const data = Object.fromEntries(new FormData(form).entries());

        // Validamos que las contrasenyes coincidan
        if (data.password !== data.confirmPassword) {
            alert("Les contrasenyes no coincideixen!");
            return;
        }

        // Enviamos los datos al servidor
        const res = await fetch("/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // Obtenemos la respuesta del servidor
        const result = await res.json();
        alert(result.message);

        if (result.success) form.reset();
    });
});