document.addEventListener("DOMContentLoaded", async () => {
    // Obtenemos los elementos del formulario
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("typologies");
    const containerTipologia = document.getElementById("typologies-container");
    const selectProtection = document.getElementById("protection");

    // Función para cargar los desplegables
    async function carregarDesplegables() {
        try {
            // pedimos todos los datos en paralelo para que no tarde tanto
            // Usamos las rutas genéricas de /form porque devuelven las listas completas
            const [publicacions, architectes, protections] = await Promise.all([
                fetch("/buildings/form/publications").then(res => res.json()),
                fetch("/buildings/form/architects").then(res => res.json()),
                fetch("/buildings/form/protection").then(res => res.json())
            ]);

            // Obtenemos las publicaciones
            publicacions.forEach(pub => {
                const opt = new Option(pub.title, pub.id_publication);
                if (PublicationInicial.includes(pub.id_publication)) {
                    opt.selected = true;
                }
                selectPublicacions.add(opt);
            });

            // Obtenemos los arquitectos
            architectes.forEach(arq => {
                const opt = new Option(arq.name, arq.id_architect);
                if (ArchitectInicial.includes(arq.id_architect)) {
                    opt.selected = true;
                }
                selectArquitectes.add(opt);
            });

            // Obtenemos las protecciones
            selectProtection.innerHTML = '<option value="">-- Cap --</option>';
            protections.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id_protection;
                opt.textContent = p.level;
                if (building.id_protection === p.id_protection) opt.selected = true;
                selectProtection.appendChild(opt);
            });

            // Inicializamos la librería MultiSelect
            new MultiSelect(selectArquitectes, {
                placeholder: 'Selecciona arquitectes...',
                search: true,
                selectAll: true
            });

            new MultiSelect(selectPublicacions, {
                placeholder: 'Selecciona publicacions...',
                search: true,
                selectAll: true,
                onChange: function () {
                    actualizarTipologias();
                }
            });

            // Cargar tipologías iniciales basadas en los datos actuales
            await actualizarTipologias(true);

        } catch (err) {
            console.error("Error cargando los desplegables:", err);
        }
    }

    // Función para cargar las tipologías
    async function actualizarTipologias(isInitialLoad = false) {
        // Buscamos los inputs ocultos que crea la librería con el nombre "publications[]"
        const hiddenInputs = document.querySelectorAll('input[name="publications[]"]');
        let selectedIds = Array.from(hiddenInputs).map(input => input.value);

        // Si no hay publicación, ocultamos el contenedor
        if (selectedIds.length === 0 && isInitialLoad) {
            selectedIds = initialPubs.map(String);
        }

        // Limpiar opciones anteriores
        selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

        // Si no hay publicación, ocultamos el contenedor
        if (selectedIds.length === 0) {
            containerTipologia.style.display = 'none';
            return;
        }

        containerTipologia.style.display = 'block';

        try {
            const idsString = selectedIds.join(',');
            const res = await fetch(`/buildings/edit/typologies/filter?ids=${idsString}`);
            const tipologies = await res.json();

            // Si hay tipologías, las mostramos
            if (tipologies && tipologies.length > 0) {
                // Generar opciones
                tipologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;

                    // Seleccionar la tipologia por defecto si coincide con el edificio actual
                    if (building.id_typology === t.id_typology) {
                        opt.selected = true;
                    }

                    selectTipologia.appendChild(opt);
                });
            }
        } catch (err) {
            console.error("Error carregant tipologies:", err);
        }
    }

    // Cargar desplegables iniciales
    await carregarDesplegables();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = {};

        // Recorremos el formData limpiando los nombres de la librería
        for (const [key, value] of formData.entries()) {
            if (key === 'pictures') continue;

            // Limpiamos los nombres de la librería
            const cleanKey = key.replace('[]', '');

            // Si el campo es un array, lo convertimos
            if (data[cleanKey]) {
                if (!Array.isArray(data[cleanKey])) data[cleanKey] = [data[cleanKey]];
                data[cleanKey].push(value);
            } else {
                data[cleanKey] = value;
            }
        }

        // Aseguramos arrays
        if (data.publications && !Array.isArray(data.publications)) data.publications = [data.publications];
        if (data.architects && !Array.isArray(data.architects)) data.architects = [data.architects];

        // Decidir qué imagen usar (la nueva o la antigua)
        let pictureUrls = [];

        // Obtenemos el archivo de la imagen
        const pictureInput = document.getElementById("picture");

        // Si el usuario ha seleccionado un archivo nuevo, lo subimos
        if (pictureInput.files && pictureInput.files.length > 0) {
            const uploadData = new FormData();
            for (const file of pictureInput.files) {
                uploadData.append("pictures", file);
            }

            try {
                // Subimos la imagen
                const uploadRes = await fetch("/buildings/edit/upload", {
                    method: "POST",
                    body: uploadData
                });

                // Obtenemos el resultado de la subida
                const uploadResult = await uploadRes.json();
                if (uploadResult.success) {
                    pictureUrls = uploadResult.filePaths;
                } else {
                    alert("Error al subir la nueva imagen.");
                    return;
                }
            } catch (err) {
                console.error("Error al subir la imagen:", err);
                alert("Error de conexión al subir imagen.");
                return;
            }
        }

        // Asignamos la URL final 
        data.pictureUrls = pictureUrls;

        // Validación de campos obligatorios
        const oblig = ["name", "address", "construction_year", "publications"];
        for (let field of oblig) {
            const val = data[field];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                alert(`El camp "${field}" és obligatori.`);
                return;
            }
        }


        try {
            // subimos los datos
            const res = await fetch(`/buildings/edit/${building.id_building}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            alert(result.message);
            if (result.success) window.location.href = "/buildings";
        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar el formulario.");
        }
    });
});