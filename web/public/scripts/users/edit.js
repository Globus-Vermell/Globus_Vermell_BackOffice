document.addEventListener("DOMContentLoaded", () => {
    AppUtils.GeneralFormSubmit("form-user-edit", `/users/edit/${user.id_user}`, "PUT", "/users");
});