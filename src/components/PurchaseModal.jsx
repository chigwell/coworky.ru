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
        <div className="section-label">Предоплата услуг</div>
        <h2 id="purchase-title">Оплатить услуги Coworky</h2>
        <p>
          Код предоплаты учитывает оплаченный объем информационно-образовательных и консультационных
          ИТ-услуг Coworky. После оплаты введите код в приложении; баланс будет списываться только за
          фактически выполненные ИИ-задачи.
        </p>
        <div className="purchase-options">
          <article>
            <strong>от 100 ₽</strong>
            <span>для первых консультационных ИТ-задач на реальных документах</span>
          </article>
          <article>
            <strong>СПБ</strong>
            <span>быстрая оплата услуг для физических лиц</span>
          </article>
          <article>
            <strong>Счёт</strong>
            <span>оплата услуг для ИП и юридических лиц по запросу</span>
          </article>
        </div>
        <div className="purchase-actions">
          <a className="button button-primary" href="mailto:support@coworky.ru?subject=Оплатить%20услуги%20Coworky">
            Оплатить услуги
          </a>
          <button className="button button-ghost" type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </section>
    </div>
  );
}
