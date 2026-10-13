document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterBar = document.getElementById("filterBar");
  const movieGrid = document.getElementById("movieGrid");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  const movieCards = [...document.querySelectorAll(".movie-card")];

  const videoModal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const modalTitle = document.getElementById("modalTitle");
  const playerNote = document.getElementById("playerNote");
  const closeModal = document.getElementById("closeModal");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const header = document.querySelector(".site-header");

  let activeFilter = "all";

  // Search and category filters
  function filterMovies() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    movieCards.forEach((card) => {
      const title = (card.dataset.title || "").toLowerCase();
      const categories = (card.dataset.category || "").toLowerCase();
      const matchesSearch =
        title.includes(searchTerm) || categories.includes(searchTerm);
      const matchesFilter =
        activeFilter === "all" ||
        categories.split(/\s+/).includes(activeFilter);

      const visible = matchesSearch && matchesFilter;
      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    resultCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? "title" : "titles"}`;
    emptyState.hidden = visibleCount !== 0;
    movieGrid.hidden = visibleCount === 0;
  }

  searchInput.addEventListener("input", filterMovies);

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeFilter = button.dataset.filter;

    filterBar.querySelectorAll(".filter-chip").forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle("active", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });

    filterMovies();
  });

  // Video player modal
  function openPlayer(button) {
    const videoUrl = button.dataset.play;
    if (!videoUrl) return;

    const card = button.closest(".movie-card");
    const titleElement = card?.querySelector(".card-details h3");
    const episodeTitle = button.querySelector("strong");
    const heroTitle = document.querySelector(".hero h1");

    modalTitle.textContent =
      titleElement?.textContent ||
      episodeTitle?.textContent ||
      heroTitle?.textContent.replace(/\s+/g, " ") ||
      "Watch Demo";

    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();

    videoPlayer.src = videoUrl;
    playerNote.textContent =
      "Demo video only. Replace this sample URL with your own authorized MP4 video.";

    videoModal.hidden = false;
    document.body.style.overflow = "hidden";
    closeModal.focus();

    const playPromise = videoPlayer.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        playerNote.textContent =
          "Press Play to start the demo. If it does not work, check the video URL.";
      });
    }
  }

  function closePlayer() {
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    videoModal.hidden = true;
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const playButton = event.target.closest("[data-play]");
    if (playButton) {
      openPlayer(playButton);
    }
  });

  closeModal.addEventListener("click", closePlayer);

  videoModal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closePlayer);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoModal.hidden) {
      closePlayer();
    }
  });

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // On mobile, tap the search area through this shortcut if needed.
  // Keep the desktop search visible; mobile users can use browser find
  // until a dedicated mobile search toggle is added.

  // Current copyright year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Initial catalog state
  filterMovies();
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(
    'input[type="search"], input[placeholder*="Search" i], input[aria-label*="Search" i]'
  );

  const movieCards = document.querySelectorAll(
    ".movie-card, .film-card, .catalog-card, [data-category]"
  );

  const filterButtons = document.querySelectorAll("[data-filter]");
  let activeFilter = "all";

  function filterMovies() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    movieCards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      const category = (card.dataset.category || "all").toLowerCase();

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

      filterMovies();
    });
  });
});
