
document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------
  // Copyright year
  // -----------------------------
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const menuToggle = document.querySelector(
    "#menuToggle, #menu-toggle, .menu-toggle, [data-menu-toggle]"
  );

  const navMenu = document.querySelector(
    "#navLinks, #nav-links, .nav-links, .nav-menu, nav"
  );

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("active", !isOpen);
      navMenu.classList.toggle("open", !isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("active", "open");
      });
    });
  }

  // -----------------------------
  // Movie search and category filters
  // -----------------------------
  const searchInput = document.querySelector(
    'input[type="search"], input[placeholder*="Search" i], input[aria-label*="Search" i]'
  );

  const movieCards = document.querySelectorAll(
    ".movie-card, .film-card, .catalog-card, [data-category]"
  );

  const filterButtons = document.querySelectorAll("[data-filter]");

  let activeFilter = "all";

  function filterMovies() {
    const query = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    movieCards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      const category = (
        card.dataset.category || "all"
      ).toLowerCase();

      const matchesSearch = text.includes(query);

      const matchesFilter =
        activeFilter === "all" ||
        category === activeFilter ||
        category.includes(activeFilter);

      card.style.display =
        matchesSearch && matchesFilter ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = (
        button.dataset.filter ||
        button.dataset.category ||
        "all"
      ).toLowerCase();

      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      filterMovies();
    });
  });

  filterMovies();

  // -----------------------------
  // Dailymotion video links
  // Open videos in a new browser tab
  // -----------------------------
  function getWatchUrl(videoUrl) {
    try {
      const url = new URL(videoUrl);
      const host = url.hostname.toLowerCase();

      if (
        host === "dai.ly" ||
        host === "www.dai.ly"
      ) {
        const id = url.pathname.replace(/^\/+|\/+$/g, "");

        if (id) {
          return "https://www.dailymotion.com/video/" + id;
        }
      }

      if (
        host === "dailymotion.com" ||
        host.endsWith(".dailymotion.com")
      ) {
        const match = url.pathname.match(
          /\/(?:embed\/)?video\/([a-zA-Z0-9]+)/
        );

        if (match) {
          return "https://www.dailymotion.com/video/" + match[1];
        }
      }

      return url.href;
    } catch (error) {
      return "";
    }
  }

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const playButton = target.closest("[data-play]");

    if (!playButton) {
      return;
    }

    const videoUrl = playButton.dataset.play;

    if (!videoUrl) {
      return;
    }

    const watchUrl = getWatchUrl(videoUrl);

    if (!watchUrl) {
      console.error("Invalid video URL:", videoUrl);
      return;
    }

    event.preventDefault();

    window.open(
      watchUrl,
      "_blank",
      "noopener,noreferrer"
    );
  });
});
