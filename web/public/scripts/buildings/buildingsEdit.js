document.addEventListener("DOMContentLoaded", async () => {
    // Obtenemos los elementos del formulario
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("tipologies");
    const containerTipologia = document.getElementById("typologies-container");
    const selectProtection = document.getElementById("protection");

    // Función para cargar las tipologías
    async function cargarTipologias(pubId, preselectedId = null) {
        // Limpiar opciones anteriores
        selectTipologia.innerHTML = '';

        // Si no hay publicación, ocultamos el contenedor
        if (!pubId) {
            containerTipologia.style.display = 'none';
            return;
        }

        try {
            // Petición al endpoint que creamos en el backend
            const res = await fetch(`/buildings/edit/typologies-by-publication/${pubId}`);
            const tipologies = await res.json();

            // Si hay tipologías, las mostramos
            if (tipologies && tipologies.length > 0) {
                containerTipologia.style.display = 'block';

                // Opción por defecto
                const defaultOpt = document.createElement("option");
                defaultOpt.value = "";
                defaultOpt.textContent = "-- Selecciona una tipologia --";
                selectTipologia.appendChild(defaultOpt);

                // Generar opciones
                tipologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;

                    // Seleccionar la tipologia por defecto si coincide con el edificio actual
                    if (preselectedId && t.id_typology === preselectedId) {
                        opt.selected = true;
                    }

                    selectTipologia.appendChild(opt);
                });
            } else {
                // Si no hay tipologías, ocultamos el contenedor
                containerTipologia.style.display = 'none';
            }
        } catch (err) {
            console.error("Error carregant tipologies:", err);
        }
    }

    // Función para cargar los desplegables
    async function carregarDesplegables() {
        // Obtenemos las publicaciones
        const resPub = await fetch(`/buildings/edit/${building.id_building}/publications`);
        const publicacions = await resPub.json();
        selectPublicacions.innerHTML = '<option value="">-- Selecciona una publicació --</option>';
        publicacions.forEach(pub => {
            const opt = document.createElement("option");
            opt.value = pub.id_publication;
            opt.textContent = pub.title;
            if (pub.id_publication === building.id_publication) opt.selected = true;
            selectPublicacions.appendChild(opt);
        });

        // Obtenemos los arquitectos
        const resArq = await fetch(`/buildings/edit/${building.id_building}/architects`);
        const arquitectes = await resArq.json();
        selectArquitectes.innerHTML = '<option value="">-- Selecciona un arquitecte --</option>';
        arquitectes.forEach(arq => {
            const opt = document.createElement("option");
            opt.value = arq.id_architect;
            opt.textContent = arq.name;
            if (arq.id_architect === building.id_architect) opt.selected = true;
            selectArquitectes.appendChild(opt);
        });

        // Obtenemos las protecciones
        const resProtection = await fetch(`/buildings/edit/${building.id_building}/protections`);
        const protections = await resProtection.json();
        selectProtection.innerHTML = '<option value="">-- Cap --</option>';
        protections.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id_protection;
            opt.textContent = p.level;
            if (p.id_protection === building.id_protection) opt.selected = true;
            selectProtection.appendChild(opt);
        });
    }
    // Cargar desplegables iniciales
    await carregarDesplegables();
    // Cargar tipologías iniciales
    if (building.id_publication) {
        await cargarTipologias(building.id_publication, building.id_typology);
    }
    // Evento al cambiar la publicación
    selectPublicacions.addEventListener("change", async (e) => {
        const pubId = e.target.value;
        await cargarTipologias(pubId, null);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Decidir qué imagen usar (la nueva o la antigua)
        let pictureUrl = building.picture;

        // Obtenemos el archivo de la imagen
        const pictureFile = formData.get("picture");

        // Si el usuario ha seleccionado un archivo nuevo, lo subimos
        if (pictureFile && pictureFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append("picture", pictureFile);

            try {
                // Subimos la imagen
                const uploadRes = await fetch("/buildings/edit/upload", {
                    method: "POST",
                    body: uploadData
                });

                // Obtenemos el resultado de la subida
                const uploadResult = await uploadRes.json();
                if (uploadResult.success) {
                    pictureUrl = uploadResult.filePath;
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

        // Asignamos la URL final (nueva o vieja) al objeto data que enviaremos
        data.picture = pictureUrl;

        // Validación de campos obligatorios
        const oblig = ["name", "address", "construction_year", "publications"];
        for (let field of oblig) {
            if (!data[field]) {
                alert(`El camp "${field}" és obligatori.`);
                return;
            }
        }

        // Petición PUT (actualizar datos)
        try {

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

