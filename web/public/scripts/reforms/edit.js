document.addEventListener("DOMContentLoaded", () => {
    AppUtils.GeneralFormSubmit("form-reform-edit", `/reforms/edit/${reform.id_reform}`, "PUT", "/reforms");
});