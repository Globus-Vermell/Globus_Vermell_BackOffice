document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("main-form");
    const typologiesMS = AppUtils.initMultiSelect('typologies', 'Selecciona tipologies...');
    const themesMS = AppUtils.initMultiSelect('themes', 'Selecciona temàtiques...');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        if (data.themes && !Array.isArray(data.themes)) data.themes = [data.themes];
        if (data.selectedTypologies && !Array.isArray(data.selectedTypologies)) data.selectedTypologies = [data.selectedTypologies];

        try {
            const res = await fetch("/publications/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            await Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) {
                form.reset();
                if (typologiesMS) typologiesMS.reset();
                if (themesMS) themesMS.reset();
            }
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al enviar el formulari." });
        }
    });
});