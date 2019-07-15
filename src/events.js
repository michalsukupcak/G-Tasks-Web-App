/**
 * Application event API for dispatching and handling global events.
 */
class Events {

  get DELETE_TASK_EVENT() {
    return 'gt-delete-task-event';
  }

  get DELETE_ALL_COMPLETED_TASKS_EVENT() {
    return 'gt-delete-all-completed-tasks-event';
  }

  /**
   * Class constructor.
   */
  constructor() {

    /**
     * Global event prefix/namespace.
     *
     * @type {string}
     */
    this.GLOBAL_EVENT = '__global.';

  }

  /**
   *
   * @param name
   * @param callback
   */
  addGlobalEventListener(name, callback) {
    window.addEventListener(this.getGlobalEventName(name), callback);
  }

  /**
   * Dispatches global event on window DOM.
   *
   * @param name
   * @param detail
   */
  dispatchGlobalEvent(name, detail) {
    let event;
    if (detail) {
      event = new CustomEvent(this.getGlobalEventName(name), {
        detail: detail
      });
    } else {
      event = new Event(this.getGlobalEventName(name));
    }
    window.dispatchEvent(event);
  }

  /**
   * Returns (prefixed) global event name.
   *
   * @param {string} name
   * @returns {string}
   */
  getGlobalEventName(name) {
    return this.GLOBAL_EVENT + name;
  }

}