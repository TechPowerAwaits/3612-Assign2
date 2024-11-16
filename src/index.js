document.addEventListener("DOMContentLoaded", () => {
  /*
   * Purpose: Handles all the functionality of the classes beginning with `Link-`.
   *
   * Details: The following classes are recognized:
   * - Link-text-as-link -- Copies the text into the href.
   * - Link-email -- prepends "mailto:" to the href.
   *
   * The behavior is undefined if the classes are not used on an anchor element.
   */
  function handleLinkClasses() {
    document.querySelectorAll(".Link-text-as-link").forEach((link) => {
      link.setAttribute("href", link.textContent);
    });
    document.querySelectorAll(".Link-email").forEach((link) => {
      const href = link.getAttribute("href");

      if (href) {
        link.setAttribute("href", `mailto:${href}`);
      }
    });
  }

  /*
   * Purpose: Hides the elements selected by the given query.
   *
   * Details: Only elements that have CSS defined to hide themselves when
   * data-visible is 0 will work with this function.
   */
  function hide(query) {
    document
      .querySelectorAll(query)
      .forEach((elm) => (elm.dataset.visible = "0"));
  }

  /*
   * Purpose: Makes the elements selected by the given query visible.
   *
   * Details: Only elements that have CSS defined to display themselves when
   * data-visible is 1 will work with this function.
   */
  function show(query) {
    document
      .querySelectorAll(query)
      .forEach((elm) => (elm.dataset.visible = "1"));
  }

  const selSeason = document.querySelector("#selSeason");
  selSeason.addEventListener("change", () => {
    const seasonVal = selSeason.value;
    if (seasonVal) {
      alert(seasonVal);
      hide("main > *");
      show("#browse");
    }
    selSeason.value = "";
  });

  show("#loading");
  handleLinkClasses();
  setTimeout(() => {
    hide("#loading");
    show("#home");
  }, 3000);
  //hide("#loading");
  //show("#home");
});
