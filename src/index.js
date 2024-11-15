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
   * Purpose: Makes the element with the given id visible whilst hiding siblings.
   *
   * Details: Only elements that have CSS defined to display themselves when
   * data-visible is 1 will work with this function.
   *
   * id should be the id of the target element as written within the HTML.
   */
  function show(id) {
    const target = document.querySelector(`#${id}`);
    if (target) {
      const parent = target.parentElement;
      if (parent) {
        for (const child of parent.children) {
          child.dataset.visible = 0;
        }
      }
      target.dataset.visible = 1;
    }
  }

  const selSeason = document.querySelector("#selSeason");
  selSeason.addEventListener("change", () => {
    const seasonVal = selSeason.value;
    if (seasonVal) {
      alert(seasonVal);
      show("browse");
    }
    selSeason.value = "";
  });

  handleLinkClasses();
  show("home");
});
