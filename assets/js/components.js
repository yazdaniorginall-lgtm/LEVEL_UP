function createArticleCard(article) {
  return `
    <a class="card" href="article.html?id=${article.id}">
      <img src="${article.image}" alt="${article.title}" loading="lazy">

      <div class="card-body">
        <span class="badge">${categoryName(article.category)}</span>

        <h3>${article.title}</h3>

        <p>${article.summary}</p>

        <div class="meta">
          <span>${formatDate(article.date)}</span>
          <span>${formatNumber(article.readTime)} دقیقه مطالعه</span>
          <span>${formatNumber(article.views)} بازدید</span>
        </div>
      </div>
    </a>
  `;
}


function createEditorCard(article) {
  return `
    <a class="card editor-card" href="article.html?id=${article.id}">
      <img src="${article.image}" alt="${article.title}" loading="lazy">

      <div class="card-body">
        <span class="badge">${categoryName(article.category)}</span>

        <h3>${article.title}</h3>

        <p>${article.summary}</p>

        <span class="meta">${formatDate(article.date)}</span>
      </div>
    </a>
  `;
}


function createRankItem(article, index) {
  return `
    <li>
      <a href="article.html?id=${article.id}">
        <span class="rank-num">${formatNumber(index + 1)}</span>

        <span class="rank-title">${article.title}</span>

        <span class="meta">${formatNumber(article.views)} بازدید</span>
      </a>
    </li>
  `;
}


function renderCards(container, articles) {
  if (articles.length === 0) {
    container.innerHTML = '<p class="empty">نتیجه‌ای یافت نشد.</p>';

    return;
  }

  container.innerHTML = articles.map(createArticleCard).join("");
}


function setupPagedList(container, button, articles) {
  let visibleCount = PAGE_SIZE;

  function draw() {
    renderCards(container, articles.slice(0, visibleCount));

    button.hidden = visibleCount >= articles.length;
  }

  button.onclick = () => {
    visibleCount += PAGE_SIZE;
    draw();
  };

  draw();
}
