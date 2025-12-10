document.addEventListener("DOMContentLoaded", () => {
    AppUtils.GeneralFormSubmit("form-edit-architect", `/architects/edit/${architect.id_architect}`, "PUT", "/architects");
});