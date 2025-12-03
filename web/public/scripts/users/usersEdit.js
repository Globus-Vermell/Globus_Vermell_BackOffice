// Formulario de edición de usuario
document.getElementById("form-user-edit").addEventListener("submit", async e => {
    e.preventDefault();
    // Obtenemos los datos del formulario
    const data = Object.fromEntries(new FormData(e.target).entries());

    // Enviamos los datos al servidor
    const res = await fetch(`/users/edit/${user.id_user}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    // Obtenemos la respuesta del servidor
    const result = await res.json();
    alert(result.message);

    if (result.success) window.location.href = "/users";
});