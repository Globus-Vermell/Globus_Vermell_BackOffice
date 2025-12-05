document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form-publication-edit');

    // Al crearse, leerá automáticamente los atributos 'selected' del HTML
    // y te mostrará las opciones marcadas visualmente
    if (document.getElementById('typologies')) {
        new MultiSelect(document.getElementById('typologies'), {
            placeholder: 'Selecciona tipologies...',
            search: true,
            selectAll: true
        });
    }

    if (document.getElementById('themes')) {
        new MultiSelect(document.getElementById('themes'), {
            placeholder: 'Selecciona temàtiques...',
            search: true,
            selectAll: true
        });
    }
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

        // Asegurar que selectedTypologies sea array
        if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) {
            data.selectedTypologies = [data.selectedTypologies];
        }

        // Validar que los campos obligatorios no estén vacíos
        if (data.themes && !Array.isArray(data.themes)) {
            data.themes = [data.themes];
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

            if (result.success) {
                // Recuperamos los filtros de la mochilita
                const savedFilters = sessionStorage.getItem('publications_filters') || '';

                // Redirigimos concatenando los filtros antiguos 
                window.location.href = "/publications" + savedFilters;
            }
        } catch (err) {
            console.error(err);
            alert('Error al actualizar la publicació');
        }
    });
});
