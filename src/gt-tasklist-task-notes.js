import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-input/paper-textarea';

/**
 * GTTasklistTaskNotes element.
 *
 * @polymer
 * @customElement
 */
class GTTasklistTaskNotes extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      /* Element */
      :host { display: block; }

      /* Notes */
      div.notes { color: var(--secondary-text-color); cursor: pointer; font-size: .9em; margin: 3px 0 0 0; transition: .2s ease; }
      div.notes:hover { color: var(--primary-text-color); }
      div.notes.textarea { background: var(--primary-background-color); border: 1px solid var(--separator-color); border-radius: 12px; padding: 6px 12px; }
§
    </style>

    <!-- Notes (as text) -->
    <template is="dom-if" if="[[!__showTextarea]]">
      <div title="Click to edit" class="notes" on-click="__onClickEnableShowTextarea">
        [[notes]]
      </div>
    </template>

    <!-- Notes (as textarea) -->
    <template is="dom-if" if="[[__showTextarea]]">
      <div class="notes textarea">
        <paper-textarea label="Details" value="{{notes}}" id="textarea" always-float-label="" on-blur="__onBlurDisableShowTextarea" on-keyup="__onKeyUpSetUpdateTask">
        </paper-textarea>
      </div>
    </template>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task-notes'; }

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
       * Task's notes (task.notes).
       */
      notes: {
        type: String,
        notify: true
      },

      /**
       * Shows textarea (true) or text (false) representation of notes.
       */
      __showTextarea: {
        type: Boolean,
        value: false
      },

      __updateTask: {
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

  __onBlurDisableShowTextarea() {
    this.disableShowTextarea();
  }

  __onClickEnableShowTextarea() {
    this.enableShowTextarea();
  }

  __onKeyUpSetUpdateTask() {
    this.__setUpdateTask();
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  /**
   * Hides textarea and shows notes as text and fires 'update-task' event if task needs to be updated.
   *
   * @private
   */
  disableShowTextarea() {
    this.set('__showTextarea', false);
    if (this.__updateTask) {
      this.dispatchEvent(new Event('update-task'));
    }
  }

  /**
   * Shows notes as textarea and hides text.
   *
   * @private
   */
  enableShowTextarea() {
    if (!this.completed) {
      this.set('__showTextarea', true);
      window.setTimeout(() => {
        this.shadowRoot.querySelector('#textarea').focus();
      }, 60);
    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  __setUpdateTask() {
    this.set('__updateTask', true);
  }
}

/** Register element */
window.customElements.define(GTTasklistTaskNotes.is, GTTasklistTaskNotes);
