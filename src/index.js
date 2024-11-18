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
        h2.classList.add("font-semibold");

        const p = document.createElement("p");
        p.textContent = msg;

        const li = document.createElement("li");
        li.appendChild(h2);
        li.appendChild(p);
        li.classList.add("bg-lime-400");
        li.classList.add("p-2");
        li.classList.add("rounded-lg");
        li.classList.add("text-center");
        li.classList.add("break-words");
        li.classList.add("text-pretty");
        li.classList.add("w-48");
        li.classList.add("relative");

        notifications.appendChild(li);

        setTimeout(() => {
          if (this._node.contains(li)) li.classList.add("hidden");
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

      handle: function (
        callName,
        queryStr,
        onSuccess = () => {},
        onFinish = () => {},
        domain = this.default_domain,
      ) {
        let data = this._get_cached_data(callName);

        if (!data) {
          fetch(`${domain}/${callName}.php${queryStr}`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error(
                  `Request rejected. Status Code ${response.status}.`,
                );
              }
            })
            .then((data) => {
              if (data.error) {
                throw new Error(data.error.message);
              }

              localStorage.setItem(callName, data);
              onSuccess(data);
            })
            .catch((error) => F1.notification.insert("Error", error.message))
            .finally(onFinish);
        } else {
          onSuccess(data);
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
      F1.data.handle(
        "races",
        `?season=${seasonVal}`,
        (data) => {
          console.table(data);
          hide("main > *");
          show("#browse");
        },
        () => (selSeason.value = ""),
      );
    }
  });

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
    console.log(timeToLoad);

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
