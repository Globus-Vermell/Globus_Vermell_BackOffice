document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-publication");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Convertimos FormData a un objeto, gestionando los checkboxes múltiples
        const data = {};

        // Iteramos manualmente para no perder valores repetidos (checkboxes)
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Si la clave ya existe, convertimos en array y añadimos el nuevo valor
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                // Añadimos el nuevo valor al array
                data[key].push(value);
            }
            // Si la clave no existe, la inicializamos con el valor
            else {
                data[key] = value;
            }
        }

        // 2. Aseguramos que selectedTypologies sea siempre un array (incluso si solo se marcó uno)
        if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) {
            data.selectedTypologies = [data.selectedTypologies];
        }
    });

    // Inicializamos el MultiSelect para el campo de tipologías y temas 
    new MultiSelect(document.getElementById('typologies'), {
        placeholder: 'Selecciona tipologies...',
        search: true,
        selectAll: true
    });

    if (document.getElementById('themes')) {
        new MultiSelect(document.getElementById('themes'), {
            placeholder: 'Selecciona temàtiques...',
            search: true,
            selectAll: true
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};

        // Procesamos los datos 
        for (const [key, value] of formData.entries()) {
            // Limpiamos los corchetes [] que añade la librería MultiSelect
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

        // Aseguramos que sea array por si acaso
        if (data.themes && !Array.isArray(data.themes)) {
            data.themes = [data.themes];
        }

        // Enviamos los datos
        try {
            const res = await fetch("/publications/create", {
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