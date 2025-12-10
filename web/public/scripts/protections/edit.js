document.addEventListener("DOMContentLoaded", () => {
    AppUtils.GeneralFormSubmit("form-protection-edit", `/protections/edit/${protection.id_protection}`, "PUT", "/protections");
});