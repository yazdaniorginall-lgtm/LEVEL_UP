function createHeroSlide(article, index) {
  const activeClass = index === 0 ? "active" : "";

  return `
    <div class="hero-slide ${activeClass}" style="background-image: url('${article.image}')">
      <div class="hero-content">
        <span class="badge">${categoryName(article.category)}</span>

        <h2>${article.title}</h2>

        <p>${article.summary}</p>

        <div class="meta">
          <span>${formatDate(article.date)}</span>
          <span>${formatNumber(article.views)} بازدید</span>
        </div>

        <a class="btn" href="article.html?id=${article.id}">مطالعه بیشتر</a>
      </div>
    </div>
  `;
}


function createHeroControls(count) {
  const dots = Array.from({ length: count }, (item, index) => {
    return `<button type="button" data-index="${index}" aria-label="اسلاید ${index + 1}"></button>`;
  });

  return `
    <div class="hero-controls">
      <button type="button" id="hero-prev" aria-label="قبلی">›</button>
      <button type="button" id="hero-next" aria-label="بعدی">‹</button>
    </div>

    <div class="dots">${dots.join("")}</div>
  `;
}


function initHero() {
  const hero = selectOne("#hero");
  const articles = FEATURED_IDS.map(findArticle);

  let currentIndex = 0;
  let timerId = null;

  hero.innerHTML = articles.map(createHeroSlide).join("") + createHeroControls(articles.length);

  const slides = hero.querySelectorAll(".hero-slide");
  const dots = hero.querySelectorAll(".dots button");

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, position) => slide.classList.toggle("active", position === currentIndex));
    dots.forEach((dot, position) => dot.classList.toggle("active", position === currentIndex));
  }

  function startAutoplay() {
    window.clearInterval(timerId);

    timerId = window.setInterval(() => showSlide(currentIndex + 1), 6000);
  }

  function goTo(index) {
    showSlide(index);
    startAutoplay();
  }

  selectOne("#hero-prev").addEventListener("click", () => goTo(currentIndex - 1));
  selectOne("#hero-next").addEventListener("click", () => goTo(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });

  showSlide(0);
  startAutoplay();
}


function initTicker() {
  const items = sortArticles(ARTICLES, "newest").slice(0, 6);

  const markup = items
    .map((article) => `<a class="ticker-item" href="article.html?id=${article.id}">${article.title}</a>`)
    .join("");

  selectOne("#ticker-track").innerHTML = markup + markup;
}


function initHome() {
  initHero();
  initTicker();

  selectOne("#categories").innerHTML = CATEGORIES.map((category) => `
    <a class="card cat-card" href="category.html?cat=${category.slug}">
      <span class="cat-icon">${category.icon}</span>
      ${category.name}
    </a>
  `).join("");

  renderCards(selectOne("#latest"), sortArticles(ARTICLES, "newest").slice(0, 4));

  selectOne("#editor").innerHTML = EDITOR_IDS.map(findArticle).map(createEditorCard).join("");

  selectOne("#popular").innerHTML = sortArticles(ARTICLES, "views").slice(0, 5).map(createRankItem).join("");
}


function initCategory() {
  const category = findCategory(getParam("cat"));

  if (!category) {
    window.location.replace("404.html");

    return;
  }

  const articles = sortArticles(getCategoryArticles(category.slug), "newest");

  document.title = `${category.name} | LEVEL UP`;

  selectOne("#category-icon").textContent = category.icon;
  selectOne("#category-title").textContent = category.name;
  selectOne("#category-description").textContent = category.description;
  selectOne("#category-count").textContent = `${formatNumber(articles.length)} خبر`;

  setupPagedList(selectOne("#news-list"), selectOne("#more-button"), articles);
}


function createArticleBody(article) {
  const paragraphs = article.body.map((text) => `<p>${text}</p>`);

  const figure = `
    <figure class="article-figure">
      <img src="assets/images/${article.category}/${article.id}-inline.jpg" alt="تصویر مرتبط با خبر" loading="lazy">
      <figcaption>تصویر نمونه مرتبط با خبر</figcaption>
    </figure>
  `;

  paragraphs.splice(1, 0, figure);

  return paragraphs.join("");
}


function createArticleMarkup(article) {
  const tags = article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  return `
    <nav class="breadcrumb" aria-label="مسیر راهنما">
      <a href="index.html">خانه</a>
      <span>/</span>
      <a href="category.html?cat=${article.category}">${categoryName(article.category)}</a>
      <span>/</span>
      <span>خبر</span>
    </nav>

    <span class="badge">${categoryName(article.category)}</span>

    <h1>${article.title}</h1>

    <p class="lead">${article.summary}</p>

    <div class="meta">
      <span>نویسنده: ${AUTHOR}</span>
      <span>${formatDate(article.date)} - ساعت ۱۰:۳۰</span>
      <span>${formatNumber(article.readTime)} دقیقه مطالعه</span>
      <span>${formatNumber(article.views)} بازدید</span>
    </div>

    <img class="article-cover" src="${article.image}" alt="${article.title}">

    <div class="article-body">${createArticleBody(article)}</div>

    <div class="tags">${tags}</div>

    <div class="actions">
      <button class="btn" id="share-button" type="button">اشتراک‌گذاری</button>
      <button class="btn" id="copy-button" type="button">کپی لینک</button>
    </div>

    <p class="meta" id="action-message" role="status"></p>
  `;
}


function showArticleNotFound() {
  selectOne("#article").innerHTML = `
    <div class="error-page">
      <h1>404</h1>
      <p>خبر موردنظر شما پیدا نشد.</p>
      <a class="btn" href="index.html">بازگشت به صفحه اصلی</a>
    </div>
  `;

  selectOne("#related-section").hidden = true;
}


function initArticle() {
  const article = findArticle(getParam("id"));

  if (!article) {
    showArticleNotFound();

    return;
  }

  document.title = `${article.title} | LEVEL UP`;

  selectOne("#article").innerHTML = createArticleMarkup(article);

  const sameCategory = ARTICLES.filter((item) => item.category === article.category && item.id !== article.id);
  const others = ARTICLES.filter((item) => item.category !== article.category);

  renderCards(selectOne("#related"), [...sameCategory, ...others].slice(0, 4));

  const message = selectOne("#action-message");

  selectOne("#copy-button").addEventListener("click", async () => {
    const copied = await copyText(window.location.href);

    message.textContent = copied ? "لینک خبر کپی شد." : "کپی لینک انجام نشد.";
  });

  selectOne("#share-button").addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });

      return;
    }

    message.textContent = "مرورگر شما از اشتراک‌گذاری پشتیبانی نمی‌کند؛ از دکمه کپی لینک استفاده کنید.";
  });
}


function initArchive() {
  const categorySelect = selectOne("#filter-category");
  const sortSelect = selectOne("#filter-sort");
  const searchInput = selectOne("#filter-search");

  categorySelect.innerHTML += CATEGORIES
    .map((category) => `<option value="${category.slug}">${category.name}</option>`)
    .join("");

  sortSelect.value = getParam("sort") || "newest";

  function applyFilters() {
    const baseList = categorySelect.value ? getCategoryArticles(categorySelect.value) : ARTICLES;
    const result = sortArticles(searchArticles(searchInput.value, baseList), sortSelect.value);

    selectOne("#result-count").textContent = `${formatNumber(result.length)} خبر یافت شد`;

    setupPagedList(selectOne("#news-list"), selectOne("#more-button"), result);
  }

  categorySelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);

  applyFilters();
}


function initSearch() {
  const query = (getParam("q") || "").trim();
  const results = query ? searchArticles(query) : [];

  selectOne("#search-input").value = query;

  selectOne("#search-title").textContent = query ? `نتایج جست‌وجو برای «${query}»` : "جست‌وجو در اخبار";
  selectOne("#result-count").textContent = query ? `${formatNumber(results.length)} نتیجه یافت شد` : "عبارت موردنظر را وارد کنید.";

  renderCards(selectOne("#news-list"), results);
}


function validateField(field) {
  const value = field.value.trim();
  const isEmail = field.type === "email";
  const isInvalid = !value || (isEmail && !/^\S+@\S+\.\S+$/.test(value));
  const message = isEmail ? "یک ایمیل معتبر وارد کنید." : "این فیلد نباید خالی باشد.";

  field.parentElement.querySelector(".error").textContent = isInvalid ? message : "";

  return !isInvalid;
}


function initContact() {
  const form = selectOne("#contact-form");
  const fields = form.querySelectorAll("[data-required]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = Array.from(fields).map(validateField);

    if (results.every(Boolean)) {
      selectOne("#success-message").hidden = false;
      form.reset();
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  setupLayout();

  const initializers = {
    home: initHome,
    category: initCategory,
    article: initArticle,
    archive: initArchive,
    search: initSearch,
    contact: initContact
  };

  const initializer = initializers[document.body.dataset.page];

  if (initializer) {
    initializer();
  }
});
