//* account popup
const accountBtn = document.querySelector(".account");
const accountModal = document.querySelector(".account-modal");

accountBtn.addEventListener("click", function () {
  accountModal.style.display = "block";
});

window.addEventListener("click", function (e) {
  if (e.target == accountModal) {
    accountModal.style.display = "none";
  }
});
