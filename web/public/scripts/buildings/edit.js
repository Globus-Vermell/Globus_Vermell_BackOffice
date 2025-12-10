document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("form-edificacio");

    const initialDescriptions = (building && building.buildings_descriptions)
        ? building.buildings_descriptions.sort((a, b) => a.display_order - b.display_order).map(d => d.content) : [];
    AppUtils.setupDynamicList('descriptions-container', 'button-add-description', 'extra_descriptions[]', initialDescriptions);

    AppUtils.initMultiSelect('architects', 'Selecciona arquitectes...');
    AppUtils.initMultiSelect('reforms', 'Selecciona reformes...');
    AppUtils.initMultiSelect('prizes', 'Selecciona premis...');

    const pubMS = AppUtils.initMultiSelect('publications', 'Selecciona publicacions...', {
        onChange: () => {
            AppUtils.linkPublicationsToTypologies(pubMS, 'typologies', 'typologies-container');
        }
    });

    await AppUtils.linkPublicationsToTypologies(
        pubMS,
        'typologies',
        'typologies-container',
        building.id_typology
    );

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        ["publications", "architects", "extra_descriptions", "prizes", "reforms"].forEach(field => {
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