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
       * Purpose: To keep a reference to the notification template.
       */
      _notificationTemplate: document.querySelector("#notificationTemplate"),

      /*
       * Purpose: To provide an adjustable default length of time notifications
       * stay on screen.
       */
      default_timeout: 3000,

      /*
       * Purpose: Adds a notification on screen with the given information.
       */
      insert: function (title, msg = "", timeout = this.default_timeout) {
        const notification = this._notificationTemplate.content.cloneNode(true);

        const notificationTitle =
          notification.querySelector("#notificationTitle");
        notificationTitle.id = "";
        notificationTitle.textContent = title;

        const notificationBody =
          notification.querySelector("#notificationBody");
        notificationBody.id = "";
        notificationBody.textContent = msg;

        this._node.appendChild(notification);

        setTimeout(() => {
          if (this._node.contains(notificationTitle))
            notificationTitle.parentElement.classList.add("hidden");
        }, timeout);
      },

      /*
       * Purpose: To clear all the notifications on the screen.
       */
      clearAll: function () {
        this._node.innerHTML = "";
      },
    },

    data: {
      _cache: {},

      _get_cached_data: function (dataID) {
        let data = this._cache[dataID];

        if (!data) {
          data = localStorage.getItem(dataID);
        }

        return data;
      },

      default_domain: "https://www.randyconnolly.com/funwebdev/3rd/api/f1",

      checkedFetch: async function (url) {
        const response = await fetch(url);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Request rejected. Status Code ${response.status}.`);
        }
      },
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

  /*
   * Purpose: Makes the elements selected by the given query look disabled.
   *
   * Details: Only elements that have CSS defined to disable themselves when
   * data-disabled is 1 will work with this function.
   */
  function disable(query) {
    document
      .querySelectorAll(query)
      .forEach((elm) => (elm.dataset.disabled = "1"));
  }

  /*
   * Purpose: Makes the elements selected by the given query look enabled.
   *
   * Details: Only elements that have CSS defined to enable themselves when
   * data-disabled is 0 will work with this function.
   */
  function enable(query) {
    document
      .querySelectorAll(query)
      .forEach((elm) => (elm.dataset.disabled = "0"));
  }

  /*
   * Purpose: Returns if the given element is disabled.
   */
  function is_disabled(elm) {
    return elm.dataset.disabled == "1";
  }

  const logo = document.querySelector("#logo");
  logo.addEventListener("click", () => {
    if (!is_disabled(logo)) {
      switchToHome();
    }
  });

  const selSeason = document.querySelector("#selSeason");
  selSeason.addEventListener("change", () => {
    const seasonVal = selSeason.value;
    if (seasonVal) {
      handleRaces(seasonVal);
    } else {
      F1.notification.insert(
        "Error",
        `Invalid season "${seasonVal}" selected.`,
      );
    }
  });

  async function handleRaces(year, domain = F1.data.default_domain) {
    disable(".disable-on-load");
    hide("main > *");
    F1.notification.clearAll();
    show("#mainLoading");

    const dataID = `races${year}`;
    let data = localStorage.getItem(dataID);

    if (!data) {
      try {
        data = await F1.data.checkedFetch(`${domain}/races.php?season=${year}`);

        if (data.error) {
          throw new Error(data.error.message);
        }

        data.sort((r1, r2) => r1.round - r2.round);
        localStorage.setItem(dataID, JSON.stringify(data));
      } catch (error) {
        switchToHome();
        F1.notification.insert("Error", error.message);
        data = null;
      }
    } else {
      data = JSON.parse(data);
    }

    if (data) {
      hide("#mainLoading");
      show("#browse");
      enable(".disable-on-load");

      console.table(data);
      console.log(data[0].id);
    }

    selSeason.value = "";
  }

  /*
   * Purpose: To switch the view to Home.
   *
   * Details: It will takes a minimum of about a second and a maximum of three
   * seconds to finish loading. It doesn't have anything to load; it simply
   * displays the loading screen to make the process of switching views seem
   * more impressive.
   *
   * Known Issues: It does not cache any element references; however, it is
   * assumed that this won't be a big performance issue as it isn't often that
   * the user can switch to Home.
   */
  function switchToHome() {
    const maxTimeToLoad = 3000;
    const timeToLoad = maxTimeToLoad - Math.random() * 2000;

    disable(".disable-on-load");
    hide("main > *");
    F1.notification.clearAll();
    show("#mainLoading");

    setTimeout(() => {
      hide("#mainLoading");
      show("#home");
      enable(".disable-on-load");
    }, timeToLoad);
  }

  handleLinkClasses();
  switchToHome();
});
