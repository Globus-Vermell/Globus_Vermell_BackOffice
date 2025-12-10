document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("form-edificacio");
    const containerTipologia = document.getElementById("typologies-container");
    const selectTipologia = document.getElementById("typologies");
    const descriptionsContainer = document.getElementById('descriptions-container');
    const btnAddDescription = document.getElementById('button-add-description');

    AppUtils.initMultiSelect('architects', 'Selecciona arquitectes...');
    AppUtils.initMultiSelect('reforms', 'Selecciona reformes...');
    AppUtils.initMultiSelect('prizes', 'Selecciona premis...');

    const publicationsMS = AppUtils.initMultiSelect('publications', 'Selecciona publicacions...', {
        onChange: () => actualizarTipologias()
    });

    if (building && building.buildings_descriptions) {
        building.buildings_descriptions
            .sort((a, b) => a.display_order - b.display_order)
            .forEach(desc => addDescriptionField(desc.content));
    }

    await actualizarTipologias();

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
        deleteButton.onclick = () => div.remove();

        div.appendChild(textarea);
        div.appendChild(deleteButton);
        descriptionsContainer.appendChild(div);
    }

    if (btnAddDescription) {
        btnAddDescription.addEventListener('click', () => addDescriptionField());
    }

    async function actualizarTipologias() {
        const selectedIds = publicationsMS.selectedValues;

        containerTipologia.style.display = 'none';
        selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

        if (!selectedIds || selectedIds.length === 0) return;

        try {
            const idsString = selectedIds.join(',');
            const res = await fetch(`/buildings/typologies/filter?ids=${idsString}`);
            const typologies = await res.json();

            if (typologies && typologies.length > 0) {
                containerTipologia.style.display = 'block';

                typologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;

                    if (building.id_typology == t.id_typology) {
                        opt.selected = true;
                    }
                    selectTipologia.appendChild(opt);
                });
            }
        } catch (err) {
            console.error("Error al cargar tipologías:", err);
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = AppUtils.serializeForm(form);

        ["publications", "architects", "extra_descriptions", "prizes"].forEach(field => {
            if (data[field] && !Array.isArray(data[field])) data[field] = [data[field]];
        });

        try {
            const uploadResult = await AppUtils.uploadFiles("picture", "/buildings/upload", "pictures");
            if (uploadResult && uploadResult.filePaths) {
                data.pictureUrls = uploadResult.filePaths;
            }
        } catch (err) {
            return;
        }

        try {
            const res = await fetch(`/buildings/edit/${building.id_building}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            }).then(() => {
                if (result.success) {
                    const savedFilters = sessionStorage.getItem('buildings_filters') || '';
                    window.location.href = "/buildings" + savedFilters;
                }
            });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al enviar el formulari." });
        }
    });
});