document.addEventListener("DOMContentLoaded", () => {
    AppUtils.GeneralFormSubmit("form-prize-edit", `/prizes/edit/${prize.id_prize}`, "PUT", "/prizes");
});