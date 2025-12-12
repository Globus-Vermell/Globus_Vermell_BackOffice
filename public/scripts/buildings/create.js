document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("main-form");

    AppUtils.setupDynamicList('descriptions-container', 'button-add-description', 'extra_descriptions[]');

    const architectsMS = AppUtils.initMultiSelect('architects', 'Selecciona arquitectes...');
    const reformsMS = AppUtils.initMultiSelect('reforms', 'Selecciona reformes...');
    const prizesMS = AppUtils.initMultiSelect('prizes', 'Selecciona premis...');

    const pubMS = AppUtils.initMultiSelect('publications', 'Selecciona publicacions...', {
        onChange: () => {
            AppUtils.linkPublicationsToTypologies(pubMS, 'typologies', 'typologies-container');
        }
    });

    AppUtils.linkPublicationsToTypologies(pubMS, 'typologies', 'typologies-container');

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
            if (uploadResult && uploadResult.filePaths) data.pictureUrls = uploadResult.filePaths;
        } catch (err) { return; }

        try {
            const res = await fetch("/buildings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            Swal.fire({ text: result.message, icon: result.success ? 'success' : 'error' });

            if (result.success) {
                form.reset();
                architectsMS.reset();
                reformsMS.reset();
                prizesMS.reset();
                pubMS.reset();
                AppUtils.linkPublicationsToTypologies(pubMS, 'typologies', 'typologies-container');
                document.getElementById('descriptions-container').innerHTML = '';
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al enviar el formulari." });
        }
    });
});