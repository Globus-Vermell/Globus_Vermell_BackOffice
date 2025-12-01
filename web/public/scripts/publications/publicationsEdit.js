// Formulario de edición de publicación
const form = document.getElementById('form-publication-edit');

// Evento submit del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Procesar FormData manualmente para manejar checkboxes múltiples
    const formData = new FormData(form);

    // Convertir FormData a objeto  
    const data = {};
    // Recorrer el FormData y convertirlo a un objeto
    for (const [key, value] of formData.entries()) {
        // Si el campo ya existe, convertirlo a array si no lo es
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    // Asegurar que selectedTypologies sea array
    if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) {
        data.selectedTypologies = [data.selectedTypologies];
    }

    // Validar que los campos obligatorios no estén vacíos
    if (!data.title || !data.themes || !data.publication_edition) {
        alert('Els camps title, themes i publication_edition són obligatoris.');
        return;
    }

    try {
        // Actualizar la publicación
        const res = await fetch(`/publications/edit/${publication.id_publication}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message);
        if (result.success) window.location.href = '/publications';
    } catch (err) {
        console.error(err);
        alert('Error al actualizar la publicació');
    }
});

// Al crearse, leerá automáticamente los atributos 'selected' del HTML
// y te mostrará las opciones marcadas visualmente
if (document.getElementById('typologies')) {
    new MultiSelect(document.getElementById('typologies'), {
        placeholder: 'Selecciona tipologies...',
        search: true,
        selectAll: true
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};

    // PROCESAR LOS DATOS (Limpiamos los corchetes [])
    for (const [key, value] of formData.entries()) {
        // Quitamos '[]' si la librería lo ha puesto (ej: selectedTypologies[])
        const cleanKey = key.replace('[]', '');

        if (data[cleanKey]) {
            if (!Array.isArray(data[cleanKey])) {
                data[cleanKey] = [data[cleanKey]];
            }
            data[cleanKey].push(value);
        } else {
            data[cleanKey] = value;
        }
    }

    // Unir descripciones si tienes el sistema de párrafos múltiples
    if (Array.isArray(data.description)) {
        data.description = data.description.filter(Boolean).join('\n\n');
    }

    // Asegurar que tipologías sea un array
    if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) {
        data.selectedTypologies = [data.selectedTypologies];
    }

    try {
        // Enviamos los datos (recuerda que 'publication' viene del script del EJS)
        const res = await fetch(`/publications/edit/${publication.id_publication}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message);
        if (result.success) window.location.href = '/publications';
    } catch (err) {
        console.error(err);
        alert('Error al actualizar la publicació');
    }
});