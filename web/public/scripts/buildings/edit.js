
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("typologies");
    const containerTipologia = document.getElementById("typologies-container");
    const descriptionsContainer = document.getElementById('descriptions-container');
    const btnAddDescription = document.getElementById('button-add-description');
    const selectPrizes = document.getElementById("prizes");

    function addDescriptionField(value = '') {
        const div = document.createElement('div');
        div.classList.add('description-row');

        const textarea = document.createElement('textarea');
        textarea.name = "extra_descriptions[]";
        textarea.value = value;
        textarea.rows = 3;

        const deleteButton = document.createElement('button');
        deleteButton.type = "button";
        deleteButton.innerHTML = '<img src="/images/icons/trash-2-64.png" alt="Borrar">';
        deleteButton.classList.add('delete-description-button');

        deleteButton.onclick = function () {
            div.remove();
        };

        div.appendChild(textarea);
        div.appendChild(deleteButton);
        descriptionsContainer.appendChild(div);
    }

    if (btnAddDescription) {
        btnAddDescription.addEventListener('click', () => addDescriptionField());
    }

    // Cargar descripciones existentes si las hay
    if (building.buildings_descriptions && Array.isArray(building.buildings_descriptions)) {
        // Ordenamos por display_order para asegurar la coherencia
        building.buildings_descriptions.sort((a, b) => a.display_order - b.display_order);

        building.buildings_descriptions.forEach(desc => {
            addDescriptionField(desc.content);
        });
    }

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
    new MultiSelect(document.getElementById('reforms'), {
        placeholder: 'Selecciona reformes...',
        search: true,
        selectAll: true
    });
    new MultiSelect(selectPrizes, {
        placeholder: 'Selecciona premis...',
        search: true,
        selectAll: true
    });

    await actualizarTipologias();

    async function actualizarTipologias() {
        const hiddenInputs = document.querySelectorAll('input[name="publications[]"]');
        const selectedIds = Array.from(hiddenInputs).map(input => input.value);

        containerTipologia.style.display = 'none';
        selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

        if (selectedIds.length === 0) return;

        try {
            const idsString = selectedIds.join(',');
            const res = await fetch(`/buildings/typologies/filter?ids=${idsString}`);
            const tipologies = await res.json();

            if (tipologies && tipologies.length > 0) {
                containerTipologia.style.display = 'block';

                tipologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;

                    if (building.id_typology === t.id_typology) {
                        opt.selected = true;
                    }

                    selectTipologia.appendChild(opt);
                });
            }

        } catch (err) {
            console.error(err);
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'pictures') continue;

            const cleanKey = key.replace('[]', '');

            if (data[cleanKey]) {
                if (!Array.isArray(data[cleanKey])) data[cleanKey] = [data[cleanKey]];
                data[cleanKey].push(value);
            } else {
                data[cleanKey] = value;
            }
        }

        if (data.publications && !Array.isArray(data.publications)) data.publications = [data.publications];
        if (data.architects && !Array.isArray(data.architects)) data.architects = [data.architects];

        if (data.extra_descriptions && !Array.isArray(data.extra_descriptions)) {
            data.extra_descriptions = [data.extra_descriptions];
        }
        if (data.prizes && !Array.isArray(data.prizes)) data.prizes = [data.prizes];

        let pictureUrls = [];
        const pictureInput = document.getElementById("picture");

        if (pictureInput.files && pictureInput.files.length > 0) {
            const uploadData = new FormData();
            for (const file of pictureInput.files) {
                uploadData.append("pictures", file);
            }

            try {
                const uploadRes = await fetch("/buildings/upload", {
                    method: "POST",
                    body: uploadData
                });

                const uploadResult = await uploadRes.json();
                if (uploadResult.success) {
                    pictureUrls = uploadResult.filePaths;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Error al subir la nueva imagen: " + uploadResult.message
                    });
                    return;
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Error de conexión al subir imagen."
                });
                return;
            }
        }
        data.pictureUrls = pictureUrls;

        const oblig = ["name", "address", "construction_year", "publications"];
        for (let field of oblig) {
            const val = data[field];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `El camp "${field}" és obligatori.`
                });
                return;
            }
        }

        try {
            const res = await fetch(`/buildings/edit/${building.id_building}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            Swal.fire({
                icon: result.success ? 'success' : 'error',
                title: result.success ? 'Éxit' : 'Error',
                text: result.message
            });

            if (result.success) {
                // Recuperamos los filtros de la mochilita
                const savedFilters = sessionStorage.getItem('buildings_filters') || '';

                // Redirigimos concatenando los filtros antiguos 
                window.location.href = "/buildings" + savedFilters;
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error al enviar el formulario."
            });
        }
    });
});