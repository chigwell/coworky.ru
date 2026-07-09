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
    "Desktop-приложение Coworky помогает работать с Excel, Word, презентациями, PDF и другими документами через ИИ-модели. Оплата информационно-образовательных ИТ-услуг только за фактические задачи.",
  );
  setMetaByProperty("og:title", "Coworky — ИИ для ваших рабочих документов");
  setMetaByProperty(
    "og:description",
    "Загружайте документы, задавайте вопросы, сверяйте таблицы, готовьте ответы и презентации. Windows доступен, macOS готовится. Предоплата услуг от 100 ₽.",
  );
  setMetaByProperty("og:type", "website");
  setMetaByProperty("og:url", "https://coworky.ru/");
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/");
}

export function applyDownloadMetadata() {
  document.title = "Скачать Coworky — Windows .exe, macOS скоро";
  setMetaByName(
    "description",
    "Скачайте desktop-приложение Coworky для Windows. Версия для macOS скоро появится. Работа с документами через ИИ-модели, предоплата информационно-образовательных ИТ-услуг от 100 ₽.",
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
    "Пользовательское соглашение Coworky: информационно-образовательные и консультационные ИТ-услуги по работе с ИИ, ограничения ответственности и контакты.",
  );
  setMetaByName("robots", "index,follow");
  setCanonical("https://coworky.ru/terms");
}

export function applyPaymentSuccessMetadata() {
  document.title = "Проверка оплаты — Coworky";
  setMetaByName(
    "description",
    "Страница проверки оплаты Coworky и выдачи кода пополнения после подтверждения платежа.",
  );
  setMetaByName("robots", "noindex,follow");
  setCanonical("https://coworky.ru/success");
}

export function applyPaymentFailMetadata() {
  document.title = "Оплата не завершена — Coworky";
  setMetaByName(
    "description",
    "Страница незавершенной оплаты Coworky с возможностью повторить платеж или обратиться в поддержку.",
  );
  setMetaByName("robots", "noindex,follow");
  setCanonical("https://coworky.ru/fail");
}

export function applyNotFoundMetadata() {
  document.title = "Страница не найдена — Coworky";
  setMetaByName(
    "description",
    "Страница Coworky не найдена. Вернитесь на главную или перейдите к скачиванию приложения.",
  );
  setMetaByName("robots", "noindex,follow");
}
