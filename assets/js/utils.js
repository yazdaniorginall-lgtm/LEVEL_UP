const PAGE_SIZE = 6;


function selectOne(selector) {
  return document.querySelector(selector);
}


function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}


function findCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug);
}


function findArticle(id) {
  return ARTICLES.find((article) => article.id === id);
}


function categoryName(slug) {
  const category = findCategory(slug);

  return category ? category.name : "";
}


function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


function formatNumber(value) {
  return Number(value).toLocaleString("fa-IR");
}


function getCategoryArticles(slug) {
  if (slug === "featured") {
    return FEATURED_IDS.map(findArticle);
  }

  if (slug === "reviews") {
    return ARTICLES.filter((article) => article.tags.includes(REVIEW_TAG));
  }

  return ARTICLES.filter((article) => article.category === slug);
}


function searchArticles(query, articles = ARTICLES) {
  const term = query.trim();

  if (!term) {
    return articles;
  }

  return articles.filter((article) => {
    const searchable = [article.title, article.summary, article.tags.join(" ")].join(" ");

    return searchable.includes(term);
  });
}


function sortArticles(articles, mode) {
  const sorted = [...articles];

  if (mode === "oldest") {
    return sorted.sort((first, second) => first.date.localeCompare(second.date));
  }

  if (mode === "views") {
    return sorted.sort((first, second) => second.views - first.views);
  }

  return sorted.sort((first, second) => second.date.localeCompare(first.date));
}


async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (error) {
    const field = document.createElement("textarea");

    field.value = text;
    document.body.appendChild(field);
    field.select();

    const copied = document.execCommand("copy");

    field.remove();

    return copied;
  }
}
