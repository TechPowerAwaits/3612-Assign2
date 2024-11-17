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
   * Purpose: An object containing all functionality and data specific to this
   * website.
   */
  const F1 = {
    /*
     * Purpose: Contains the functionality associated with displaying
     * notifications.
     *
     * Details: Notifications appear for a set amount of time (default 3000ms)
     * and are then automagically removed from the screen.
     */
    notification: {
      /*
       * Purpose: To keep a reference to the notifications node.
       */
      _node: document.querySelector("#notifications"),

      /*
       * Purpose: To provide an adjustable default length of time notifications
       * stay on screen.
       */
      default_timeout: 3000,

      /*
       * Purpose: Adds a notification on screen with the given information.
       */
      insert: function (title, msg = "", timeout = this.default_timeout) {
        const h2 = document.createElement("h2");
        h2.textContent = title;

        const p = document.createElement("p");
        p.textContent = msg;

        const li = document.createElement("li");
        li.appendChild(h2);
        li.appendChild(p);

        notifications.insertBefore(li, this._node.firstElementChild);

        setTimeout(() => {
          if (this._node.contains(li)) this._node.removeChild(li);
        }, timeout);
      },
    },

    /*
     * Purpose: To clear all the notifications on the screen.
     */
    clearAll: function () {
      this._node.innerHTML = "";
    },
  };

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
      const apiDomain = "https://www.randyconnolly.com/funwebdev/3rd/api/f1";
      const racesCall = `races.php?season=${seasonVal}`;
      fetch(`${apiDomain}/${racesCall}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              `Request rejected. Status Code ${response.status}.`,
            );
          }
        })
        .then((racesData) => {
          if (racesData.error) {
            throw new Error(racesData.error.message);
          }
          console.table(racesData);
          hide("main > *");
          show("#browse");
        })
        .catch((error) => F1.notification.insert("Error", error.message))
        .finally(() => (selSeason.value = ""));
    }
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
