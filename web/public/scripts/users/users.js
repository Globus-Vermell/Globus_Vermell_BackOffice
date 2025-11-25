// Función para eliminar un usuario
async function deleteUser(id) {
    // Confirmar la eliminación
    if (!confirm("Segur que vols eliminar aquest usuari?")) return;

    const res = await fetch(`/users/delete/${id}`, { method: "DELETE" });
   // Procesar la respuesta del servidor
    const data = await res.json();

    alert(data.message);
    if (data.success) location.reload();
}

// Función para filtrar usuarios
function filterUsers(text) {
    // Obtenemos todas las partes relevantes directamente desde el ejs 
    const s = text.toLowerCase();
    const cards = document.querySelectorAll('.card');

    //Filtramos las cards por nombre o descripción para ver si coinciden con el término de búsqueda
    cards.forEach(c => {
        const name = c.dataset.name.toLowerCase();
        const desc = c.dataset.description.toLowerCase();
        c.style.display = (name.includes(s) || desc.includes(s)) ? 'flex' : 'none';
    });
}