document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("typologies");
    const containerTipologia = document.getElementById("typologies-container");

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

    async function actualizarTipologias() {
        const hiddenInputs = document.querySelectorAll('input[name="publications[]"]');
        const selectedIds = Array.from(hiddenInputs).map(input => input.value);

        selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

        if (selectedIds.length === 0) {
            containerTipologia.style.display = 'none';
            return;
        }

        containerTipologia.style.display = 'block';

        try {
            const idsString = selectedIds.join(',');
            const res = await fetch(`/buildings/typologies/filter?ids=${idsString}`);
            const tipologies = await res.json();

            if (tipologies && tipologies.length > 0) {
                tipologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;
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
                if (!Array.isArray(data[cleanKey])) {
                    data[cleanKey] = [data[cleanKey]];
                }
                data[cleanKey].push(value);
            } else {
                data[cleanKey] = value;
            }
        }

        if (data.publications && !Array.isArray(data.publications)) data.publications = [data.publications];
        if (data.architects && !Array.isArray(data.architects)) data.architects = [data.architects];

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
                    alert("Error al pujar la imatge: " + uploadResult.message);
                    return;
                }
            } catch (err) {
                console.error(err);
                alert("Error de connexió al pujar imatge.");
                return;
            }
        }
        data.pictureUrls = pictureUrls;

        const obligatorios = ["name", "address", "construction_year", "publications"];
        for (let field of obligatorios) {
            const val = data[field];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                alert(`El camp "${field}" és obligatori.`);
                return;
            }
        }

        try {
            const res = await fetch("/buildings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            alert(result.message);
            if (result.success) {
                form.reset();
                containerTipologia.style.display = 'none';
            }

        } catch (err) {
            console.error(err);
            alert("Error al enviar el formulari.");
        }
    });
});