document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll('.api-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const url = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';
            const redirectUrl = form.dataset.redirect;
            const data = AppUtils.serializeForm(form);

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await res.json();

                await Swal.fire({
                    text: result.message,
                    icon: result.success ? 'success' : 'error'
                });

                if (result.success) {
                    if (redirectUrl) window.location.href = redirectUrl;
                    else if (method.toUpperCase() === 'POST') form.reset();
                }
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error de connexió.' });
            }
        });
    });


    document.body.addEventListener('click', async (e) => {

        const deleteBtn = e.target.closest('.delete-button');
        if (deleteBtn) {
            const url = deleteBtn.dataset.url;
            const confirmMsg = deleteBtn.dataset.confirm || "Segur que vols eliminar aquest element?";

            if (!url) return console.error("Falta data-url en el botón eliminar");

            const result = await Swal.fire({
                title: 'Estàs segur?',
                text: confirmMsg,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar!'
            });

            if (result.isConfirmed) {
                try {
                    const res = await fetch(url, { method: "DELETE" });
                    const data = await res.json();

                    await Swal.fire({
                        text: data.message,
                        icon: data.success ? 'success' : 'error'
                    });

                    if (data.success) window.location.reload();
                } catch (err) {
                    console.error(err);
                    Swal.fire({ icon: 'error', title: 'Error', text: "Error de connexió." });
                }
            }
        }

        const validateBtn = e.target.closest('.validation-button');
        if (validateBtn) {
            const url = validateBtn.dataset.url;
            const confirmMsg = validateBtn.dataset.confirm || "Segur que vols validar aquest element?";

            if (!url) return;

            const result = await Swal.fire({
                title: 'Validar?',
                text: confirmMsg,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, validar'
            });

            if (result.isConfirmed) {
                try {
                    const res = await fetch(url, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ validated: true })
                    });
                    const data = await res.json();

                    await Swal.fire({ text: data.message, icon: data.success ? 'success' : 'error' });
                    if (data.success) window.location.reload();
                } catch (err) {
                    Swal.fire({ icon: 'error', title: 'Error', text: "Error al validar." });
                }
            }
        }
    });
});