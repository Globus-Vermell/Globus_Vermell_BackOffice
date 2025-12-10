document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-edificacio");
    const containerTipologia = document.getElementById("typologies-container");
    const selectTipologia = document.getElementById("typologies");
    const descriptionsContainer = document.getElementById('descriptions-container');
    const btnAddDescription = document.getElementById('button-add-description');

    const architectsMS = AppUtils.initMultiSelect('architects', 'Selecciona arquitectes...');
    const reformsMS = AppUtils.initMultiSelect('reforms', 'Selecciona reformes...');
    const prizesMS = AppUtils.initMultiSelect('prizes', 'Selecciona premis...');

    const publicationsMS = AppUtils.initMultiSelect('publications', 'Selecciona publicacions...', {
        onChange: () => actualizarTipologias()
    });

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

        if (selectedIds.length === 0) return;

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
                    selectTipologia.appendChild(opt);
                });
            }
        } catch (err) {
            console.error("Error cargando tipologías:", err);
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = AppUtils.serializeForm(form);

        ["publications", "architects", "extra_descriptions", "prizes"].forEach(field => {
            if (data[field] && !Array.isArray(data[field])) data[field] = [data[field]];
        });

        const obligatorios = ["name", "address", "construction_year", "publications"];
        for (let field of obligatorios) {
            const val = data[field];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                return Swal.fire({ icon: 'warning', title: 'Atenció', text: `El camp "${field}" és obligatori.` });
            }
        }

        try {
            const uploadResult = await AppUtils.uploadFiles("picture", "/buildings/upload", "pictures");

            if (uploadResult && uploadResult.filePaths) {
                data.pictureUrls = uploadResult.filePaths;
            }
        } catch (err) {
            return;
        }

        try {
            const res = await fetch("/buildings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) {
                form.reset();
                architectsMS.reset();
                publicationsMS.reset();
                reformsMS.reset();
                prizesMS.reset();
                containerTipologia.style.display = 'none';
                descriptionsContainer.innerHTML = '';
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al enviar el formulari." });
        }
    });
});