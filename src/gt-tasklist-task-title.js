import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-input/paper-input';

/**
 * GTTasklistTaskTitle element.
 *
 * @polymer
 * @customElement
 */
class GTTasklistTaskTitle extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      /* Element */
      :host { display: block; }

      /* Title */
      div.title { cursor: pointer; }
      div.title.input { background: var(--primary-background-color); border: 1px solid var(--separator-color); border-radius: 12px; padding: 6px 12px; }
      div.title.completed { color: #666; text-decoration: line-through; }

    </style>

    <!-- Title (as text) -->
    <template is="dom-if" if="[[!__showInput]]">
      <div title="Click to edit" class\$="[[__getTitleClass(completed)]]" on-click="__onClickEnableShowInput">
        [[title]]
      </div>
    </template>

    <!-- Title (as input) -->
    <template is="dom-if" if="[[__showInput]]">
      <div class="title input">
        <paper-input label="Title" value="{{title}}" id="input" always-float-label="" on-blur="__onBlurDisableShowInput" on-keyup="__onKeyUpHandleTitleInput">
        </paper-input>
      </div>
    </template>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task-title'; }

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
       * Tasks's title (task.title).
       */
      title: {
        type: String,
        notify: true
      },

      /**
       * Shows input (true) or text (false) representation of notes.
       */
      __showInput: {
        type: Boolean,
        value: false
      },

      /**
       * Determines if update-task event should be fired (true) on input blur or not (false).
       */
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

  __onBlurDisableShowInput() {
    this.disableShowInput();
  }

  __onClickEnableShowInput() {
    this.enableShowInput();
  }

  __onKeyUpHandleTitleInput(event) {
    if (event.keyCode === 13) {
      this.disableShowInput();
    } else {
      this.__setUpdateTask();
    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  /**
   * Hides input and shows title as text and fires 'update-task' event if task needs to be updated.
   *
   * @private
   */
  disableShowInput() {
    this.set('__showInput', false);
    if (this.__updateTask) {
      this.dispatchEvent(new Event('update-task'));
    }
  }

  /**
   * Shows title as input and hides text.
   *
   * @private
   */
  enableShowInput() {
    if (!this.completed) {
      this.set('__showInput', true);
      window.setTimeout(() => {
        let input = this.shadowRoot.querySelector('#input');
        input.focus();
        input.$.nativeInput.selectionStart = 0;
        input.$.nativeInput.selectionEnd = this.title ? this.title.length : 0;
      }, 60);
    }
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  //Empty

  /**
   * Returns 'title completed' css class for task title if task is completed or simply 'title' if not.
   *
   * @param completed
   * @returns {string}
   * @private
   */
  __getTitleClass(completed) {
    return completed ? 'title completed' : 'title';
  }

  /**
   * Sets __updateTask property to true.
   *
   * @private
   */
  __setUpdateTask() {
    this.set('__updateTask', true);
  }
}

/** Register element */
window.customElements.define(GTTasklistTaskTitle.is, GTTasklistTaskTitle);
