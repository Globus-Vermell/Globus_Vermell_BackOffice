document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reform");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const res = await fetch("/reforms/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);
            if (result.success) form.reset();
        } catch (err) {
            console.error(err);
            alert("Error al enviar el formulari.");
        }
    });
});