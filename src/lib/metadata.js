function setMetaByName(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function applyHomeMetadata() {
  document.title = "Coworky — ИИ для Word, Excel, PDF и презентаций без VPN";
  setMetaByName(
    "description",
    "Desktop-приложение Coworky помогает работать с Excel, Word, презентациями, PDF и другими документами через сильные ИИ-модели. Без VPN и прокси. Оплата только за использование.",
  );
  setMetaByProperty("og:title", "Coworky — ИИ для ваших рабочих документов");
  setMetaByProperty(
    "og:description",
    "Загружайте документы, задавайте вопросы, сверяйте таблицы, готовьте ответы и презентации. Windows и macOS. Пополнение от 100 ₽.",
  );
  setMetaByProperty("og:type", "website");
  setMetaByProperty("og:url", "https://coworky.ru/");
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/");
}

export function applyDownloadMetadata() {
  document.title = "Скачать Coworky — Windows .exe и macOS .dmg";
  setMetaByName(
    "description",
    "Скачайте desktop-приложение Coworky для Windows или macOS. Работа с документами через ИИ-модели, пополнение от 100 ₽, оплата только за использование.",
  );
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/download");
}

export function applyPrivacyMetadata() {
  document.title = "Политика обработки данных — Coworky";
  setMetaByName(
    "description",
    "Политика обработки персональных данных сервиса Coworky: состав данных, цели обработки, хранение технических данных авторизации и контакты поддержки.",
  );
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/privacy");
}

export function applyTermsMetadata() {
  document.title = "Пользовательское соглашение — Coworky";
  setMetaByName(
    "description",
    "Пользовательское соглашение Coworky: образовательный ресурс для работы с ИИ, ограничения ответственности, права на модели и контакты поддержки.",
  );
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/terms");
}

export function applyNotFoundMetadata() {
  document.title = "Страница не найдена — Coworky";
  setMetaByName(
    "description",
    "Страница Coworky не найдена. Вернитесь на главную или перейдите к скачиванию приложения.",
  );
  setMetaByName("robots", "noindex,follow");
}
