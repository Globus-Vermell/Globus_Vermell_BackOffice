document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-user");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = AppUtils.serializeForm(form);

        if (data.password !== data.confirmPassword) {
            return Swal.fire({ icon: 'warning', title: 'Atenció', text: "Les contrasenyes no coincideixen!" });
        }

        try {
            const res = await fetch("/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            await Swal.fire({
                text: result.message,
                icon: result.success ? 'success' : 'error'
            });

            if (result.success) form.reset();
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error de connexió." });
        }
    });
});