export function PurchaseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="purchase-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Закрыть окно" onClick={onClose}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className="section-label">Код пополнения</div>
        <h2 id="purchase-title">Пополнить баланс Coworky</h2>
        <p>
          Лицензионный код пополняет баланс Coworky. После оплаты введите код в приложении и расходуйте баланс только
          на фактические запросы к выбранным ИИ‑моделям.
        </p>
        <div className="purchase-options">
          <article>
            <strong>от 100 ₽</strong>
            <span>для первых задач и тестирования на реальных документах</span>
          </article>
          <article>
            <strong>СПБ</strong>
            <span>быстрое пополнение для физических лиц</span>
          </article>
          <article>
            <strong>Счёт</strong>
            <span>оплата для ИП и юридических лиц</span>
          </article>
        </div>
        <div className="purchase-actions">
          <a className="button button-primary" href="mailto:support@coworky.ru?subject=Пополнить%20баланс%20Coworky">
            Пополнить баланс
          </a>
          <button className="button button-ghost" type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </section>
    </div>
  );
}
