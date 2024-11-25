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
        resetBrowseView();

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

      current: [],
      racesIdx: 0,
      qualifyingIdx: 1,
      resultsIdx: 2,

      default_domain: "https://www.randyconnolly.com/funwebdev/3rd/api/f1",

      checkedFetch: async function (url) {
        const response = await fetch(url);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Request rejected. Status Code ${response.status}.`);
        }
      },

      throwOnDataError: function (data) {
        data.forEach((item) => {
          if (item.error) {
            throw new Error(item.error.message);
          }
        });
      },

      driverData: [],
      driverID: "drivers",
      prepDriverData: async function (domain = F1.data.default_domain) {
        let data = localStorage.getItem(F1.data.driverID);

        if (!data) {
          try {
            data = await F1.data.checkedFetch(`${domain}/drivers.php`);
            F1.data.throwOnDataError(data);
            localStorage.setItem(F1.data.driverID, JSON.stringify(data));
          } catch (error) {
            F1.notification.insert("Error", error.message);
            data = null;
          }
        } else {
          data = JSON.parse(data);
        }

        if (data) {
          F1.data.driverData = data;
        }
      },
      isDriverFav: function (driverID) {
        const targetDriver = F1.data.driverData.find(
          (driver) => driver.driverId == driverID,
        );

        return targetDriver && targetDriver.fav;
      },
      toggleDriverFav: function (driverID) {
        const targetDriver = F1.data.driverData.find(
          (driver) => driver.driverId == driverID,
        );

        if (targetDriver) {
          targetDriver.fav = !targetDriver.fav;
          localStorage.setItem(F1.data.driverID, JSON.stringify(data));
        }
      },
      getDriver: function (driverID) {
        return F1.data.driverData.find((driver) => driver.driverId == driverID);
      },

      constructorData: [],
      constructorID: "constructors",
      prepConstructorData: async function (domain = F1.data.default_domain) {
        let data = localStorage.getItem(F1.data.constructorID);

        if (!data) {
          try {
            data = await F1.data.checkedFetch(`${domain}/constructors.php`);
            F1.data.throwOnDataError(data);
            localStorage.setItem(F1.data.constructorID, JSON.stringify(data));
          } catch (error) {
            F1.notification.insert("Error", error.message);
          }
        } else {
          data = JSON.parse(data);
        }

        if (data) {
          F1.data.constructorData = data;
        }
      },
      isConstructorFav: function (constructorID) {
        const targetConstructor = F1.data.constructorData.find(
          (constructor) => constructor.constructorId == constructorID,
        );

        return targetConstructor && targetConstructor.fav;
      },
      toggleConstructorFav: function (constructorID) {
        const targetConstructor = F1.data.constructorData.find(
          (constructor) => constructor.constructorId == constructorID,
        );

        if (targetConstructor) {
          targetConstructor.fav = !targetConstructor.fav;
          localStorage.setItem(F1.data.constructorID, JSON.stringify(data));
        }
      },
      getConstructor: function (constructorID) {
        return F1.data.constructorData.find(
          (constructor) => constructor.constructorId == constructorID,
        );
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
      populateRaces(racesTable, F1.data.current[F1.data.racesIdx], e.target);
    }
  });

  const qualifyingTable = document.querySelector("#qualifyingTable");
  const resultsTable = document.querySelector("#resultsTable");
  racesTable.addEventListener("click", (e) => {
    const raceID = e.target.dataset.raceID;

    if (e.target.dataset.raceID) {
      resetBrowseView();
      qualifyingTable.dataset.raceID = raceID;
      resultsTable.dataset.raceID = raceID;

      setRaceInfoBlock(F1.data.current[F1.data.racesIdx], raceID);

      populateQualifying(
        qualifyingTable,
        F1.data.current[F1.data.qualifyingIdx],
        raceID,
        qualifyingTable.querySelector('[data-sort = "position"]'),
      );
      populateResults(
        resultsTable,
        F1.data.current[F1.data.resultsIdx],
        raceID,
        qualifyingTable.querySelector('[data-sort = "position"]'),
      );

      F1.state.show("#raceResults");
    }
  });

  qualifyingTable.addEventListener("click", (e) => {
    if (e.target.dataset.sort) {
      populateQualifying(
        qualifyingTable,
        F1.data.current[F1.data.qualifyingIdx],
        qualifyingTable.dataset.raceID,
        e.target,
      );
    }
  });

  qualifyingTable.addEventListener("click", (e) => {
    if (e.target.dataset.constructorID) {
      const dialog = document.querySelector("#constructor");
      prepConstructorDialog(
        dialog,
        F1.data.getConstructor(e.target.dataset.constructorID),
      );
      dialog.showModal();
    }
  });

  qualifyingTable.addEventListener("click", (e) => {
    if (e.target.dataset.driverID) {
      const dialog = document.querySelector("#driver");
      prepDriverDialog(
        dialog,
        F1.data.getDriver(e.target.dataset.driverID),
        F1.data.current[F1.data.resultsIdx].filter(
          (result) => result.driver.id == e.target.dataset.driverID,
        ),
      );
      dialog.showModal();
    }
  });

  resultsTable.addEventListener("click", (e) => {
    if (e.target.dataset.sort) {
      populateResults(
        resultsTable,
        F1.data.current[F1.data.resultsIdx],
        resultsTable.dataset.raceID,
        e.target,
      );
    }
  });

  resultsTable.addEventListener("click", (e) => {
    if (e.target.dataset.constructorID) {
      const dialog = document.querySelector("#constructor");
      prepConstructorDialog(
        dialog,
        F1.data.getConstructor(e.target.dataset.constructorID),
      );
      dialog.showModal();
    }
  });

  resultsTable.addEventListener("click", (e) => {
    if (e.target.dataset.driverID) {
      const dialog = document.querySelector("#driver");
      prepDriverDialog(
        dialog,
        F1.data.getDriver(e.target.dataset.driverID),
        F1.data.current[F1.data.resultsIdx].filter(
          (result) => result.driver.id == e.target.dataset.driverID,
        ),
      );
      dialog.showModal();
    }
  });

  document.querySelector("#circuitBtn").addEventListener("click", (e) => {
    if (e.currentTarget.dataset.circuitID) {
      const circuitData = F1.data.current[F1.data.racesIdx].find(
        (race) => race.circuit.id == e.currentTarget.dataset.circuitID,
      ).circuit;
      const dialog = document.querySelector("#circuit");
      prepCircuitDialog(dialog, circuitData);
      dialog.showModal();
    }
  });

  /*
   * Purpose: Preps the constructor dialog with the provided data.
   */
  function prepConstructorDialog(dialog, constructorData, resultsData) {
    dialog.querySelector("#constructorDiagName").textContent =
      constructorData.name;
    dialog.querySelector("#constructorDiagNationality").textContent =
      constructorData.nationality;
    dialog
      .querySelector("#constructorDiagURL")
      .setAttribute("href", constructorData.url);

    /*populateDiagResults(
      dialog.querySelector("#constructorDiagTable"),
      resultsData,
    );*/

    function populateDiagResults(list, data) {
      clearNonHeaderRows(list);
      data.forEach((result) => {
        appendText(list, result.race.round);
        appendText(list, result.race.name);
        appendText(
          list,
          `${resultsData.driver.forename} ${resultsData.driver.surname}`,
        );
        appendText(list, result.position);
        appendText(list, result.points);
      });
    }
  }

  /*
   * Purpose: Preps the driver dialog with the provided data.
   */
  function prepDriverDialog(dialog, driverData, driverResultsData) {
    dialog.querySelector("#driverDiagName").textContent =
      `${driverData.forename} ${driverData.surname}`;
    dialog.querySelector("#driverDiagNationality").textContent =
      driverData.nationality;

    const [year, monthNumStr, dayStr] = driverData.dob.split("-");
    dialog.querySelector("#driverDiagMonth").textContent = getShortMonthName(
      Number.parseInt(monthNumStr),
    );
    dialog.querySelector("#driverDiagDay").textContent =
      Number.parseInt(dayStr);
    dialog.querySelector("#driverDiagYear").textContent = year;

    dialog.querySelector("#driverDiagAge").textContent = calcAge(
      driverData.dob,
    );
    dialog.querySelector("#driverDiagURL").setAttribute("href", driverData.url);

    populateDiagResults(
      dialog.querySelector("#driverDiagTable"),
      driverResultsData,
    );

    function populateDiagResults(list, data) {
      clearNonHeaderRows(list);
      data.forEach((result) => {
        appendText(list, result.race.round);
        appendText(list, result.race.name);
        appendText(list, result.position);
        appendText(list, result.points);
      });
    }
  }

  /*
   * Purpose: Preps the circuit dialog with the provided data.
   */
  function prepCircuitDialog(dialog, circuitData) {
    dialog.querySelector("#circuitDiagName").textContent = circuitData.name;
    dialog.querySelector("#circuitDiagLocation").textContent =
      circuitData.location;
    dialog.querySelector("#circuitDiagCountry").textContent =
      circuitData.country;
    dialog.querySelector("#circuitDiagLat").textContent = circuitData.lat;
    dialog.querySelector("#circuitDiagLng").textContent = circuitData.lng;
    dialog
      .querySelector("#circuitDiagURL")
      .setAttribute("href", circuitData.url);
  }

  /*
   * Purpose: Resets the browse view.
   */
  function resetBrowseView() {
    F1.state.hide("#raceResults");
    racesTable.dataset.currSort = "";
    qualifyingTable.dataset.currSort = "";
    resultsTable.dataset.currSort = "";
  }

  /*
   * Purpose: To show information on the given race to the user.
   *
   * Details: If the given raceID is invalid, fallback data will
   * be displayed instead.
   */
  function setRaceInfoBlock(data, raceID) {
    let info = data.find((elm) => elm.id == raceID);

    if (!info) {
      info = {
        year: 1970,
        round: 0,
        name: "Unknown Race",
        date: "1970-01-01",
        url: "https://www.google.com/teapot",
        circuit: {
          id: 0,
          name: "Unknown Circuit",
          url: "https://music.youtube.com/watch?v=RQMpfnsi5Wk&si=o5evz6KvMoGK5hve",
        },
      };
    }

    document.querySelector("#raceLink").setAttribute("href", info.url);
    document.querySelector("#raceYear").textContent = info.year;
    document.querySelector("#raceName").textContent = info.name;
    document.querySelector("#raceRound").textContent = info.round;
    document.querySelector("#circuitBtn").dataset.circuitID = info.circuit.id;
    document.querySelector("#circuitName").textContent = info.circuit.name;
    document
      .querySelector("#circuitLink")
      .setAttribute("href", info.circuit.url);
    document
      .querySelector("#dateLink")
      .setAttribute("href", genDateLink(info.date));
    document.querySelector("#raceDate").textContent = info.date;

    /*
     * Purpose: To generate a URL to a webpage that contains information on the
     * date provided.
     *
     * Details: The date provided must be a string and in the form: YYYY-MM-DD.
     *
     * Returns: A string containing a valid URL.
     */
    function genDateLink(date) {
      const baseUrl = "https://www.onthisday.com/date";
      const [year, monthNumStr, day] = date.split("-");
      const monthNum = Number.parseInt(monthNumStr);

      return `${baseUrl}/${year}/${getMonthName(monthNum)}/${day}`;
    }
  }

  /*
   * Purpose: Get a month's full name from its numeric value.
   *
   * Details: This numeric value starts at 1 for the first month.
   *
   * Returns: A string with the month's name or undefined if monthVal
   * is invalid.
   */
  function getMonthName(monthVal) {
    const monthNumName = [
      undefined,
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthVal < monthNumName.length ? monthNumName[monthVal] : undefined;
  }

  /*
   * Purpose: To get the month's short name from its numeric value.
   *
   * Details: This numeric value starts at 1 for the first month.
   *
   * Returns: A string with the month's name or undefined if monthVal
   * is invalid.
   */
  function getShortMonthName(monthVal) {
    const monthName = getMonthName(monthVal);
    const shortMonthLen = 3;

    let shortMonthName = undefined;

    if (monthName) {
      shortMonthName = monthName.slice(0, shortMonthLen);
    }

    return shortMonthName;
  }

  /*
   * Purpose: To calculate someone's age based on when they were born.
   *
   * Details: The date of birth needs to be in the following format: "yyyy-mm-dd".
   */
  function calcAge(dob) {
    const [yearStr, monthNumStr, dayStr] = dob.split("-");
    const monthNum = Number.parseInt(monthNumStr);
    const day = Number.parseInt(dayStr);

    const currDate = new Date();
    const diffYear = currDate.getFullYear() - yearStr;
    let age = diffYear;

    // Date's getMonth() method starts at zero.
    const currMonth = currDate.getMonth() + 1;

    if (
      currMonth < monthNum ||
      (currMonth == monthNum && currDate.getDate() < day)
    ) {
      age -= 1;
    }

    return age;
  }

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

  /*
   * Purpose: Updates the arrows representing the sorting direction in the
   * given list.
   */
  function updateSortArrow(list, sortColElm, descend) {
    list
      .querySelectorAll(".upArrow, .downArrow")
      .forEach((arrow) => (arrow.dataset.visible = "0"));

    sortColElm.querySelector(
      descend ? ".upArrow" : ".downArrow",
    ).dataset.visible = "1";
  }

  /*
   * Purpose: To clear all non-header rows in the given list.
   */
  function clearNonHeaderRows(list) {
    list
      .querySelectorAll(":not(.colHeader):is(li)")
      .forEach((cell) => (cell.outerHTML = ""));
  }

  /*
   * Purpose: To sort the content of the given array by the provided column name.
   *
   * Details: By default, data will be sorted in ascending order. The original
   * array is left untouched.
   *
   * If the attribute to sort by is not at the top-level of an object, the path to
   * the target can be specified with dots. For instance, a sortCol value of
   * "subobj.target" will result in a comparison with the target attribute inside
   * the subobj to determine the ordering of the data.
   *
   * Returns: A sorted array of data.
   */
  function sortTabularData(data, sortCol, descending = false) {
    const colPathSep = ".";
    const colPath = sortCol.split(colPathSep);

    return data.toSorted((d1, d2) => {
      let t1 = d1;
      let t2 = d2;

      for (let i = 0; i < colPath.length; i++) {
        t1 = t1[colPath[i]];
        t2 = t2[colPath[i]];
      }

      return (descending ? -1 : 1) * (t1 > t2 ? 1 : t1 < t2 ? -1 : 0);
    });
  }

  /*
   * Purpose: Populates all the race information into the races table.
   */
  function populateRaces(list, data, sortColElm) {
    const sortCol = sortColElm.dataset.sort;
    const descending = shouldSortDescend(list, sortCol);

    updateSortArrow(list, sortColElm, descending);
    clearNonHeaderRows(list);

    sortTabularData(data, sortCol, descending).forEach((race) => {
      appendText(list, race.round);
      appendText(list, race.name);

      const btn = createArrowButton();
      btn.dataset.raceID = race.id;
      appendNode(list, btn);
    });

    list.dataset.currSort = sortCol;
  }

  /*
   * Purpose: Populates all the qualifying information for the given race into the qualifying
   * table.
   */
  function populateQualifying(list, data, raceID, sortColElm) {
    const sortCol = sortColElm.dataset.sort;
    const descending = shouldSortDescend(list, sortCol);

    updateSortArrow(list, sortColElm, descending);
    clearNonHeaderRows(list);

    const qualRaceData = data.filter((qual) => qual.race.id == raceID);

    sortTabularData(qualRaceData, sortCol, descending).forEach((qual) => {
      appendText(list, qual.position);
      appendDriverName(list, qual.driver);
      appendConstructorName(list, qual.constructor);
      appendText(list, qual.q1 ? qual.q1 : "N/A");
      appendText(list, qual.q2 ? qual.q2 : "N/A");
      appendText(list, qual.q3 ? qual.q3 : "N/A");
    });

    list.dataset.currSort = sortCol;
  }

  /*
   * Purpose: Populates all the results information for the given race into the results
   * table.
   */
  function populateResults(list, data, raceID, sortColElm) {
    const sortCol = sortColElm.dataset.sort;
    const descending = shouldSortDescend(list, sortCol);

    updateSortArrow(list, sortColElm, descending);
    clearNonHeaderRows(list);

    const resultRaceData = data.filter((qual) => qual.race.id == raceID);

    sortTabularData(resultRaceData, sortCol, descending).forEach((result) => {
      appendPositionNode(result.position);
      const styleClasses = getPositionStyling(result.position);

      appendDriverName(list, result.driver, ...styleClasses);
      appendConstructorName(list, result.constructor, ...styleClasses);
      appendText(list, result.laps, ...styleClasses);
      appendText(list, result.points, ...styleClasses);
    });

    list.dataset.currSort = sortCol;

    /*
     * Purpose: Appends a newly-created node representing a position.
     *
     * Returns: The created node.
     */
    function appendPositionNode(position) {
      const specialPositions = 3;
      const styling = "text-3xl";

      let createdNode;

      switch (position) {
        case 1:
          createdNode = appendText(list, "🥇");
          break;
        case 2:
          createdNode = appendText(list, "🥈");
          break;
        case 3:
          createdNode = appendText(list, "🥉");
          break;
        default:
          createdNode = appendText(list, position);
      }

      if (position <= specialPositions) {
        createdNode.classList.add(styling);
      }

      return createdNode;
    }

    /*
     * Purpose: To get a list of style classes to be applied to nodes based on
     * the provided position.
     *
     * Returns: An array of strings.
     */
    function getPositionStyling(position) {
      let styleClasses = [];

      switch (position) {
        case 1:
          styleClasses = ["text-yellow-500"];
          break;
        case 2:
          styleClasses = ["text-stone-300"];
          break;
        case 3:
          styleClasses = ["text-orange-500"];
          break;
      }

      return styleClasses;
    }
  }

  /*
   * Purpose: Appends the given driver to the provided list.
   *
   * Details: Classes to add to the generated nodes can be provided at the end of
   * the parameter list.
   *
   * Returns: An array of the nodes created.
   */
  function appendDriverName(list, driver, ...classes) {
    const driverFNameBtn = createTextButton(driver.forename);
    const driverLNameBtn = createTextButton(driver.surname);

    driverFNameBtn.dataset.driverID = driver.id;
    driverLNameBtn.dataset.driverID = driver.id;

    appendNode(list, driverFNameBtn, ...classes);
    appendNode(list, driverLNameBtn, ...classes);

    return [driverFNameBtn, driverLNameBtn];
  }

  /*
   * Purpose: Appends the given constructor to the provided list.
   *
   * Details: Classes to add to the generated node can be provided at the end of
   * the parameter list.
   *
   * Returns: The created node that stores the constructor's name.
   */
  function appendConstructorName(list, constructor, ...classes) {
    const constBtn = createTextButton(constructor.name);
    constBtn.dataset.constructorID = constructor.id;
    return appendNode(list, constBtn, ...classes);
  }

  /*
   * Purpose: Appends the given node onto a list.
   *
   * Details: Classes to add to the node can be provided at the end of
   * the parameter list.
   *
   * Returns: The given node.
   */
  function appendNode(list, node, ...classes) {
    const nodeWrapper = document.createElement("li");

    classes.forEach((nodeClass) => node.classList.add(nodeClass));

    nodeWrapper.appendChild(node);
    list.appendChild(nodeWrapper);

    return node;
  }

  /*
   * Purpose: Appends the given text onto a list inside a wrapper element.
   *
   * Details: Classes to add to the generated node can be provided at the end of
   * the parameter list.
   *
   * Returns: The element containing the text.
   */
  function appendText(list, text, ...classes) {
    const textWrapper = document.createElement("span");
    textWrapper.textContent = text;
    return appendNode(list, textWrapper, ...classes);
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

    let data = localStorage.getItem(dataID);

    if (!data) {
      try {
        data = await Promise.all([
          F1.data.checkedFetch(`${domain}/races.php?season=${year}`),
          F1.data.checkedFetch(`${domain}/qualifying.php?season=${year}`),
          F1.data.checkedFetch(`${domain}/results.php?season=${year}`),
        ]);

        F1.data.throwOnDataError();

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
      F1.data.current = data;

      const h2 = F1.data._racesSection.querySelector("h2");
      const h2Text = h2.textContent.replace("[year]", year);
      h2.textContent = h2Text;

      populateRaces(
        racesTable,
        data[F1.data.racesIdx],
        racesTable.querySelector('[data-sort = "round"]'),
      );

      F1.state.hide("#mainLoading");
      F1.state.show("#browse");
      F1.state.logoButton.removeAttribute("disabled");
    }

    selSeason.value = "";
  }

  /*
   * Purpose: Creates and returns a small button with a right-facing arrow.
   *
   * Details: The created element is not added to the DOM.
   *
   * Returns: A (very pretty) button.
   */
  function createArrowButton() {
    const btn = document.createElement("button");

    btn.textContent = ">";
    btn.setAttribute("type", "button");
    btn.classList.add(
      "rounded-sm",
      "bg-slate-500",
      "px-1",
      "hover:bg-blue-300",
    );

    return btn;
  }

  /*
   * Purpose: Creates and returns a styled text-based button with the given
   * button.
   *
   * Details: The created element is not added to the DOM.
   *
   * Returns: A (hyperlink-looking) button.
   */
  function createTextButton(text) {
    const btn = document.createElement("button");

    btn.textContent = text;
    btn.setAttribute("type", "button");
    btn.classList.add("underline", "decoration-dotted", "hover:text-blue-300");

    return btn;
  }

  F1.data.prepDriverData();
  F1.data.prepConstructorData();
  F1.state.switchToHome();
});
