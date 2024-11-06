document.addEventListener("DOMContentLoaded", () => {
  function showHome() {
    const home = document.querySelector("#home");
    home.style.display = "flex";
    home.style.justifyContent = "space-between";
  }

  showHome();
});
