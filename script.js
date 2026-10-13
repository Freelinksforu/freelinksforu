document.addEventListener("DOMContentLoaded", function () {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // YouTube and Dailymotion video player
  const videoPlayer = document.getElementById("videoPlayer");
  const modalTitle = document.getElementById("modalTitle");
  const playerNote = document.getElementById("playerNote");

  function getEmbedUrl(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      if (host.includes("youtube.com")) {
        let videoId = "";

        if (parsed.pathname.startsWith("/shorts/")) {
          videoId = parsed.pathname.split("/")[2];
        } else if (parsed.pathname === "/watch") {
          videoId = parsed.searchParams.get("v") || "";
        } else if (parsed.pathname.startsWith("/embed/")) {
          videoId = parsed.pathname.split("/")[2];
        }

        if (videoId) {
          return "https://www.youtube-nocookie.com/embed/" + videoId;
        }
      }

      if (host === "youtu.be") {
        const videoId = parsed.pathname.replace(/^\/+|\/+$/g, "");
        if (videoId) {
          return "https://www.youtube-nocookie.com/embed/" + videoId;
        }
      }

      return "";
    } catch (error) {
      return "";
    }
  }

  function openPlayer(button) {
    const videoUrl = button.dataset.play;
    if (!videoUrl || !videoPlayer) return;

    const embedUrl = getEmbedUrl(videoUrl);

    if (!embedUrl) {
      if (playerNote) {
        playerNote.textContent =
          "Please use a valid YouTube Shorts or YouTube video link.";
      }
      return;
    }

    videoPlayer.src = embedUrl;
    if (modalTitle) {
      modalTitle.textContent =
        button.dataset.title || "Watch Video";
    }
    if (playerNote) {
      playerNote.textContent = "Playing video from YouTube.";
    }

    const modal = document.getElementById("videoModal");
    if (modal) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
    } else {
      videoPlayer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-play]");
    if (!button) return;

    event.preventDefault();
    openPlayer(button);
  });

  // Close player modal
  const closeButtons = document.querySelectorAll(
    "#closeModal, .close-modal, [data-close-modal]"
  );

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const modal = document.getElementById("videoModal");
      if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
      if (videoPlayer) videoPlayer.src = "";
    });
  });

  // Search and category filters
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

      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      filterMovies();
    });
  });

  filterMovies();
});
