function setupTheme() {
  applyTheme(getStoredTheme());

  selectOne("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    saveTheme(next);
    applyTheme(next);
  });
}


function setupMoreMenu() {
  const toggle = selectOne("#more-toggle");
  const menu = selectOne("#more-menu");

  function setOpen(isOpen) {
    menu.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!menu.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".more-wrap")) {
      setOpen(false);
    }
  });

  return () => setOpen(false);
}


function setupSideMenu() {
  const menu = selectOne("#side-menu");
  const overlay = selectOne("#overlay");

  function setOpen(isOpen) {
    menu.classList.toggle("open", isOpen);
    overlay.classList.toggle("open", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  }

  selectOne("#menu-toggle").addEventListener("click", () => setOpen(true));
  selectOne("#menu-close").addEventListener("click", () => setOpen(false));
  overlay.addEventListener("click", () => setOpen(false));

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  return () => setOpen(false);
}


function setupSearchBar() {
  const bar = selectOne("#search-bar");

  selectOne("#search-toggle").addEventListener("click", () => {
    bar.classList.toggle("open");

    if (bar.classList.contains("open")) {
      bar.querySelector("input").focus();
    }
  });

  return () => bar.classList.remove("open");
}


function highlightActiveLink() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  const current = fileName + window.location.search;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === current);
  });
}


function setupLayout() {
  setupTheme();
  highlightActiveLink();

  const closeActions = [setupMoreMenu(), setupSideMenu(), setupSearchBar()];

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeActions.forEach((close) => close());
    }
  });
}
