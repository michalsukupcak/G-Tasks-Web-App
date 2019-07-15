import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import './gt-tasklist-task-date-input.js';
import './gt-tasklist-task-due.js';
import './gt-tasklist-task-links.js';
import './gt-tasklist-task-notes.js';
import './gt-tasklist-task-title.js';

/**
 * GTTasklistTask element.
 *
 * @polymer
 * @customElement
 */
class GTTasklistTask extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style>

      :host {
        display: block;
      }

      div.task { @apply --layout-horizontal; @apply --layout-start; border-bottom: 1px solid var(--separator-color); padding: 12px 6px 13px 16px; transition: .2s ease; }
      div.task div.checkbox {}
      div.task div.checkbox paper-checkbox { cursor: pointer; margin: 13px 6px 0 0; }
      div.task div.content { @apply --layout-flex; padding: 11px 0 0 0; }
      div.task div.content gt-tasklist-task-title {}
      div.task div.content gt-tasklist-task-notes {}
      div.task div.content div.labels { @apply --layout-horizontal; margin: 9px 0 0 0; }
      div.task div.content div.labels gt-tasklist-task-due {}
      div.task div.content div.labels gt-tasklist-task-links { @apply --layout-flex; }

      div.task div.content div.add-buttons { display: none; margin: 6px 0 0 0; }
      div.task div.content div.add-buttons div.add-button { @apply --layout-horizontal; @apply --layout-center; color: var(--secondary-text-color); cursor: pointer; font-size: .9em; margin: 0 24px 0 0; transition: .2s ease; }
      div.task div.content div.add-buttons div.add-button:hover { color: var(--primary-color); }
      div.task div.content div.add-buttons div.add-button iron-icon { --iron-icon-height: 16px; --iron-icon-width: 16px; }
      div.task div.content div.add-buttons div.add-button span { margin: 2px 0 0 6px; }


      div.task div.clear-button paper-icon-button { color: white; }

      div.task:hover { background: var(--hover-color); }
      div.task:hover > div.clear-button paper-icon-button { color: var(--secondary-text-color); }
      div.task:hover > div.clear-button paper-icon-button:hover { color: red; }
      div.task:hover > div.content div.add-buttons { @apply --layout-horizontal; }

      div.task.hidden { display: none; }

    </style>

    <!-- Task -->
    <div id="container" class="task">

      <!-- Checkbox -->
      <div class="checkbox">
        <paper-checkbox title="Mark as done" checked="[[__completed]]" id="checkbox" icon="icons:radio-button-unchecked" on-click="__onClickToggleCompleted">
        </paper-checkbox>
      </div>

      <!-- Content -->
      <div class="content">

        <!-- Title -->
        <gt-tasklist-task-title completed="[[__completed]]" id="title" title="{{task.title}}" on-update-task="__onUpdateTask">
        </gt-tasklist-task-title>

        <!-- Labels -->
        <div class="labels">

          <!-- Due date -->
          <div hidden$="[[__isDatePickerInputEnabled(shouldShowDatePicker, task.status)]]">
            <gt-tasklist-task-due completed="[[__completed]]" due="{{task.due}}" on-click="__onClickAddDueDate">
            </gt-tasklist-task-due>
          </div>

          <!-- Links -->
          <gt-tasklist-task-links completed="[[__completed]]" links="{{task.links}}">
          </gt-tasklist-task-links>

        </div>
        
        <!-- Notes -->
        <gt-tasklist-task-notes completed="[[__completed]]" id="notes" notes="{{task.notes}}" on-update-task="__onUpdateTask">
        </gt-tasklist-task-notes>
        
        <div hidden$="[[!__isDatePickerInputEnabled(shouldShowDatePicker)]]">
          <gt-tasklist-task-date-input due="{{task.due}}" id="datePicker" on-opened-state-changed="__onOpenedStateChanged" on-update-task="__onUpdateTask">
          </gt-tasklist-task-date-input>
        </div>

        <!-- Add buttons -->
        <template is="dom-if" if="[[__showAddButtons(__completed, task)]]">
          <div class="add-buttons">

            <!-- Add title -->
            <div hidden$="[[__isTaskTitleEmpty(task.title)]]">
              <div class="add-button" on-click="__onClickAddTitle">
                <iron-icon icon="icons:create"></iron-icon>
                <span>Add title</span>
              </div>
            </div>

            <!-- Add notes -->
            <div hidden$="[[task.notes]]">
              <div class="add-button" on-click="__onClickAddNotes">
                <iron-icon icon="icons:assignment"></iron-icon>
                <span>Add details</span>
              </div>
            </div>

            <!-- Add due -->
            <div hidden$="[[__isDatePickerInputEnabledByDue(shouldShowDatePicker, task.due)]]">
              <div class="add-button" on-click="__onClickAddDueDate">
                <iron-icon icon="icons:event"></iron-icon>
                <span>Add due date</span>
              </div>
            </div>
        
          </div>
        </template>

      </div>

      <!-- Delete button -->
      <div class="clear-button">
        <paper-icon-button title="Click to delete task" icon="icons:clear" class="delete" on-click="__onClickDeleteTask"></paper-icon-button>
      </div>

    </div>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist-task'; }

  static get properties() {
    return {

      __completed: {
        type: Boolean
      },

      dueDate: {
        type: Number,
        default: 0
      },

      shouldShowDatePicker: {
        type: Boolean,
        default: false
      },

      /**
       * Task
       * @see https://developers.google.com/tasks/v1/reference/tasks#resource
       */
      task: {
        type: Object,
        notify: true
      },

      taskIndex: {
        type: Number
      },

      tasklistId: {
        type: String
      }

    }
  }

  static get observers() {
    return [
      '__taskCompletedChanged(task.completed)'
    ]
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  /** Callback */
  connectedCallback() {

    // Parent connected callback
    super.connectedCallback();

    // Ugly checkbox UI design hack :)
    if (this.$.checkbox.$.checkbox) {
      this.$.checkbox.$.checkbox.style.borderRadius = '12px';
    }

  }

  ready() {
    super.ready()

    this.set('shouldShowDatePicker', false);
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onClickAddDueDate() {
    this.__addDueDate();
  }

  __onClickAddNotes() {
    this.__addNotes();
  }

  __onClickAddTitle() {
    this.__addTitle();
  }

  __onClickDeleteTask() {
    this.hideTask();
    this.__deleteTask();
  }

  __onClickToggleCompleted() {
    this.__toggleCompleted();
  }

  __onOpenedStateChanged(event) {
    if (!event.detail.isOpened && this.shouldShowDatePicker) {
      this.__disableDatePickerInput();
    }
  }

  __onUpdateTask() {
    this.__updateTask();
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  /**
   * Temporary hide task
   *
   * @public
   */
  hideTask() {
    this.$.container.classList.add('hidden');
  }

  /**
   * Unhide temporary hidden task
   *
   * @public
   */
  unhideTask() {
    this.$.container.classList.remove('hidden');
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  //Empty

  /**
   * Shows date picker
   *
   * @private
   */
  __addDueDate() {
    this.set('shouldShowDatePicker', !this.shouldShowDatePicker);
    this.shadowRoot.querySelector('#datePicker').openDatePicker();
  }

  /**
   * Shows notes as textarea
   *
   * @private
   */
  __addNotes() {
    this.$.notes.enableShowTextarea();
  }

  /**
   * Shows title as input
   *
   * @private
   */
  __addTitle() {
    this.$.title.enableShowInput();
  }

  /**
   * Dispatch event about prepared task deletion
   *
   * @private
   */
  __deleteTask() {
    EVENTS.dispatchGlobalEvent(EVENTS.DELETE_TASK_EVENT, {
      task: this.task,
      taskIndex: this.taskIndex
    });
  }

  /**
   * Disable date picker input
   *
   * @private
   */
  __disableDatePickerInput() {
    this.set('shouldShowDatePicker', false);
  }

  /**
   * Check if is date picker enabled
   *
   * @private
   */
  __isDatePickerInputEnabled(shouldShowDatePicker) {
    return shouldShowDatePicker;
  }

  /**
   * Check if is date picker enabled with relation to due
   *
   * @private
   */
  __isDatePickerInputEnabledByDue(shouldShowDatePicker, due) {
    return due !== undefined && !shouldShowDatePicker;
  }

  /**
   * Check if title is empty
   *
   * @param title
   * @private
   */
  __isTaskTitleEmpty(title) {
    return !!title;
  }

  /**
   * Shows add buttons(title, notes, date), according to individual states
   *
   * @params completed, task
   * @private
   */
  __showAddButtons(completed, task) {
    return !completed && (!task.title || !task.notes || !task.due);
  }

  /**
   * Set task completed state
   *
   * @param completed
   * @private
   */
  __taskCompletedChanged(completed) {
    this.set('__completed', !!completed);
  }

  /**
   * Toggle task completion value.
   *
   * @private
   */
  __toggleCompleted() {
    let status;
    if (this.__completed) {
      status = 'needsAction';
      this.set('task.completed', null);
    } else {
      status = 'completed';
      this.set('__completed', true);
    }
    this.set('task.status', status);
    this.__updateTask();
  }

  /**
   * Update task.
   * @see https://developers.google.com/tasks/v1/reference/tasks/update
   *
   * @private
   */
  __updateTask() {
    gapi.client.request({
      path: 'https://www.googleapis.com/tasks/v1/lists/' + this.tasklistId + '/tasks/' + this.task.id,
      method: 'PUT',
      body: this.task
    }).then(response => {
      this.set('task', response.result);
      this.dispatchEvent(new Event('task-updated'));
    });
  }

}

/** Register element */
window.customElements.define(GTTasklistTask.is, GTTasklistTask);
