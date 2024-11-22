document.addEventListener("DOMContentLoaded", () => {
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

        const notificationTitle = notification.querySelector("h2");
        notificationTitle.textContent = title;

        const notificationBody = notification.querySelector("p");
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

    /*
     * Purpose: Handles anything affecting the state of
     * elements.
     */
    state: {
      /* Purpose: To store a reference to the logo's button in the header. */
      logoButton: document.querySelector("#logoButton"),

      /*
       * Purpose: Hides the elements selected by the given query.
       *
       * Details: Only elements that have CSS defined to hide themselves when
       * data-visible is 0 will work with this function.
       */
      hide: function (query) {
        document
          .querySelectorAll(query)
          .forEach((elm) => (elm.dataset.visible = "0"));
      },

      /*
       * Purpose: Makes the elements selected by the given query visible.
       *
       * Details: Only elements that have CSS defined to display themselves when
       * data-visible is 1 will work with this function.
       */
      show: function (query) {
        document
          .querySelectorAll(query)
          .forEach((elm) => (elm.dataset.visible = "1"));
      },

      /*
       * Purpose: To switch the view to Home.
       *
       * Details: It will takes a minimum of about a second and a maximum of three
       * seconds to finish loading. It doesn't have anything to load; it simply
       * displays the loading screen to make the process of switching views seem
       * more impressive.
       *
       * Known Issues: It does not cache some element references; however, it is
       * assumed that this won't be a big performance issue as it isn't often that
       * the user can switch to Home.
       */
      switchToHome: function () {
        const maxTimeToLoad = 3000;
        const timeToLoad = maxTimeToLoad - Math.random() * 2000;

        F1.state.logoButton.setAttribute("disabled", "");
        F1.state.hide("main > *");
        F1.notification.clearAll();
        F1.state.show("#mainLoading");

        setTimeout(() => {
          F1.state.hide("#mainLoading");
          F1.state.show("#home");
          F1.state.logoButton.removeAttribute("disabled");
        }, timeToLoad);
      },
    },

    data: {
      _racesTemplate: document.querySelector("#racesTemplate"),

      _racesResultsBtnTemplate: document.querySelector(
        "#racesResultsBtnTemplate",
      ),

      _racesSection: document.querySelector("#races"),

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

  F1.state.logoButton.addEventListener("click", F1.state.switchToHome);

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

  const racesTable = F1.data._racesSection.querySelector("ul");
  racesTable.addEventListener("click", (e) => {
    if (e.target.dataset.sort) {
      const descending = shouldSortDescend(racesTable, e.target.dataset.sort);

      racesTable
        .querySelectorAll(
          `[data-sort = \"${racesTable.dataset.currSort}\"] > *`,
        )
        .forEach((arrow) => (arrow.dataset.visible = "0"));

      e.target.querySelector(
        descending ? ".downArrow" : ".upArrow",
      ).dataset.visible = "1";
    }

    racesTable.dataset.currSort = e.target.dataset.sort;
  });

  /*
   * Purpose: Determines if an upcoming sort operation should be ascending or descending.
   *
   * Details: The provided list object is modified to keep track of when a sort was last
   * descending. Sorting is guaranteed ascending by default except for every second
   * consecutive operation to sort by the same column.
   *
   * Returns: True if the sort operation should be descending. False otherwise.
   */
  function shouldSortDescend(list, sortCol) {
    const sameAsPrev = sortCol === list.dataset.currSort;
    let descending = false;

    if (list.dataset.descending === "1" || !sameAsPrev) {
      descending = false;
      list.dataset.descending = "0";
    } else {
      descending = true;
      list.dataset.descending = "1";
    }

    return descending;
  }

  function populateList(list, data, sortCol) {
    //
  }

  /*
   * Details: It is assumed that the retrieved data is unsorted.
   */
  async function handleRaces(year, domain = F1.data.default_domain) {
    F1.state.logoButton.setAttribute("disabled", "");
    F1.state.hide("main > *");
    F1.notification.clearAll();
    F1.state.show("#mainLoading");

    const dataID = `allRaceData${year}`;

    const racesIdx = 0;
    const qualifyingIdx = 1;

    let data = localStorage.getItem(dataID);

    if (!data) {
      try {
        data = await Promise.all([
          F1.data.checkedFetch(`${domain}/races.php?season=${year}`),
          F1.data.checkedFetch(`${domain}/qualifying.php?season=${year}`),
        ]);

        if (data[racesIdx].error) {
          throw new Error(data[racesIdx].error.message);
        }

        data[racesIdx].sort((r1, r2) => r1.round - r2.round);

        if (data[qualifyingIdx].error) {
          throw new Error(data[qualifyingIdx].error.message);
        }

        data[qualifyingIdx].sort((q1, q2) => q1.position - q2.position);

        data.sort((r1, r2) => r1.round - r2.round);
        localStorage.setItem(dataID, JSON.stringify(data));
      } catch (error) {
        F1.state.switchToHome();
        F1.notification.insert("Error", error.message);
        data = null;
      }
    } else {
      data = JSON.parse(data);
    }

    if (data) {
      //populateRaces(selSeason.value, data[racesIdx]);
      F1.state.hide("#mainLoading");
      F1.state.show("#browse");
      F1.state.logoButton.removeAttribute("disabled");
    }

    selSeason.value = "";
  }

  function populateRaces(year, racesData) {
    const racesTable = F1.data._racesTemplate.content.cloneNode(true);

    const h2 = racesTable.querySelector("h2");
    const h2Text = h2.textContent.replace("[year]", year);
    h2.textContent = h2Text;

    const tableBody = racesTable.querySelector("tbody");

    racesData.forEach((race) => {
      const rnd = document.createElement("td");
      rnd.textContent = race.round;

      const name = document.createElement("td");
      name.textContent = race.name;

      const btnWrapper =
        F1.data._racesResultsBtnTemplate.content.cloneNode(true);
      btnWrapper.querySelector("button").dataset.racesId = race.id;

      const tr = document.createElement("tr");
      tr.appendChild(rnd);
      tr.appendChild(name);
      tr.appendChild(btnWrapper);

      tableBody.appendChild(tr);
    });

    F1.data._racesSection.innerHTML = "";
    F1.data._racesSection.appendChild(racesTable);
  }

  F1.state.switchToHome();
});
