import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-input/paper-input';

/**
 * GTTasklistTaskDue element.
 *
 * @polymer
 * @customElement
 */
class GTTasklistTaskDue extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      /* Element */
      :host { display: block; }

      /* Title */
      div.due { background: var(--secondary-background-color); border: 1px solid var(--separator-color); border-radius: 6px; color: var(--primary-color); cursor: pointer; font-size: .9em; margin: 0 12px 0 0; padding: 4px 9px; }
      div.due:hover { background: var(--highlight-color); }

    </style>

    <template is="dom-if" if="[[due]]">
      <div title="Click to change" class="due">
        [[__getDueDate(due)]]
      </div>
    </template>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task-due'; }

  /** Element properties */
  static get properties() {
    return {

      /**
       * Indicates if task is completed (true) or not (false).
       */
      completed: {
        type: Boolean,
        value: false
      },

      /**
       * Tasks's due date (task.due).
       */
      due: {
        type: String,
        notify: true
      },

      /**
       * Shows input (true) or text (false) representation of notes.
       */
      showInput: {
        type: Boolean,
        value: false
      }

    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  // Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  __getDueDate(due) {
    if (due) {
      return moment( due ).calendar( null, {
        lastDay:  '[Yesterday]',
        sameDay:  '[Today]',
        nextDay:  '[Tomorrow]',
        nextWeek: 'DD.MM.YYYY',
        lastWeek: 'DD.MM.YYYY',
        sameElse: 'DD.MM.YYYY'
      });
    } else {
      return '';
    }
  }

}

/** Register element */
window.customElements.define(GTTasklistTaskDue.is, GTTasklistTaskDue);
