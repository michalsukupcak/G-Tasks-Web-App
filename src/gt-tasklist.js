import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/utils/async';
import '@polymer/polymer/lib/utils/debounce';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';
import '@polymer/iron-selector/iron-selector';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-ripple/paper-ripple';
import '@polymer/paper-spinner/paper-spinner';
import './gt-tasklist-task.js';

/**
 * GTTasklist element.
 *
 * @polymer
 * @customElement
 */
class GTTasklist extends PolymerElement {

  static get template() { return html`

    <!-- CSS -->
    <style include="gt-styles"></style>
    <style>

      /* Element */
      :host { display: block; }

      /* Loader / spinner */
      div.loader { padding: 24px 0; text-align: center; }
      div.loader paper-spinner {}

      div.add-task { margin: 12px 16px; }
      div.add-task paper-input {
        @apply --shadow-elevation-2dp;
        background: var(--primary-color);
        border-radius: 24px;
        cursor: pointer;
        padding: 3px 24px 0 24px;
        transition: .2s ease;
        width: 138px;
        --paper-input-container-underline: { display: none; };
        --paper-input-container-underline-focus: { display: none; };
        --paper-input-container-label: { color: white; font-family: 'Product Sans', sans-serif; };
        --paper-input-container-input: { font-family: 'Product Sans', sans-serif; }
      }
      div.add-task paper-input div[slot="prefix"] {}
      div.add-task paper-input div[slot="prefix"] iron-icon { --iron-icon-height: 20px; --iron-icon-width: 20px; color: white; margin: 0 6px 3px 0; }
      div.add-task paper-input[focused] { background: var(--focused-color); border-radius: 12px; box-shadow: none; cursor: text; width: calc(100% - 48px); --paper-input-container-label: { display: none; }; }
      div.add-task paper-input[focused] div[slot="prefix"] iron-icon { color: var(--primary-color); }
      
      /* Completed task title */
      div.completed-title {
        border-radius: 24px;
        color: #666;
        cursor: pointer;
        font-size: 1.2em;
        margin: 48px 0 0 0;
        padding: 12px;
        position: relative;
        width: 226px;
      }

    </style>

    <template is="dom-if" if="[[showLoader]]">
      <div class="loader">
        <paper-spinner active=""></paper-spinner>
      </div>
    </template>

    <template id="taskListContainer" is="dom-if" if="[[!showLoader]]">

      <template id="nonCompletedTaskList" is="dom-repeat" items="{{tasks}}" as="task" filter="[[__filterNonCompletedTasks]]">
        <gt-tasklist-task id="task-id-[[task.id]]" task-index="[[index]]" task="{{task}}" tasklist-id="[[tasklist.id]]" on-task-updated="__onTaskUpdated"></gt-tasklist-task>
      </template>

      <div class="add-task">
        <paper-input label="Add new task" id="addTaskTitleInput" no-label-float="" on-blur="__onBlurInput" on-keyup="__onKeyUpHandleAddTaskInput">
          <div slot="prefix">
            <iron-icon icon="icons:add"></iron-icon>
          </div>
        </paper-input>
      </div>

      <div>
        <div class="completed-title" on-click="__onClickToggleCompletedTasks">
          <iron-icon icon="[[__getCompletedTitleIcon(showCompletedTasks)]]"></iron-icon>
          <span>Completed tasks ([[__getCompletedTaskSum(shouldReloadTaskCount)]])</span>
          <paper-ripple></paper-ripple>
        </div>
      </div>

      <!-- Completed task list -->
      <template id="completedTaskList" is="dom-if" if="[[showCompletedTasks]]">
        <template is="dom-repeat" items="{{tasks}}" as="task" filter="__filterCompletedTasks">
          <gt-tasklist-task id="completed-task-id-[[task.id]]" task-index="[[index]]" task="{{task}}" tasklist-id="[[tasklist.id]]" on-task-updated="__onTaskUpdated"></gt-tasklist-task>
        </template>
      </template>

    </template>
    
  `; }

  /** Define element name */
  static get is() { return 'gt-tasklist'; }

  /** Element properties */
  static get properties() {
    return {

      removedTasks: {
        type: Array
      },

      /**
       * Selected task for removal
       */
      task: {
        type: Object,
        notify: true
      },

      tasklist: {
        type: Object
      },

      /**
       * Array of tasklists.
       * @see https://developers.google.com/tasks/v1/reference/tasklists#resource
       */
      tasks: {
        type: Array
      },

      showCompletedTasks: {
        type: Boolean,
        value: false
      },

      showLoader: {
        type: Boolean,
        value: false
      },

      shouldReloadTaskCount: {
        type: Boolean,
        value: false
      },

      timerId: {
        type: Number
      }

    }
  }

  /** Property observers */
  static get observers() {
    return [
      'tasklistChanged(tasklist)'
    ]
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Element lifecycle */

  connectedCallback() {
    super.connectedCallback();
    EVENTS.addGlobalEventListener(EVENTS.DELETE_TASK_EVENT, this.__onDeleteClickTask.bind(this));
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Observers and event listeners */

  __onBlurInput() {
    this.__blurInput();
  }

  __onClickDeleteTask() {
    this.__deleteTask();
  }

  __onClickToggleCompletedTasks() {
    this.__toggleCompletedTasks();
  }

  __onDeleteClickTask(event) {
    this.__prepareTaskDeletion(event.detail);
  }

  __onKeyUpHandleAddTaskInput(event) {
    if (event.keyCode === 13) {
      this.__handleAddTaskInput();
    }
  }

  __onTaskUpdated() {
    this.set('shouldReloadTaskCount', true);
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Public API */

  /**
   * @see https://developers.google.com/tasks/v1/reference/tasks/list
   *
   * @param tasklist
   * @private
   */
  tasklistChanged(tasklist) {
    if (tasklist === undefined) {
      return;
    }

    this.set('showLoader', true);
    gapi.client.request({
      path: 'https://www.googleapis.com/tasks/v1/lists/' + tasklist.id + '/tasks',
      method: 'GET'
    }).then(response => {
      this.set('tasks', response.result.items);
      this.set('showLoader', false);

      this.shadowRoot.querySelector('#taskListContainer').render();
      this.set('shouldReloadTaskCount', true);
    });
  }

  /**
   * Undo task deletion
   *
   * @public
   */
  undoDelete() {
    clearTimeout(this.timerId);
    this.__changeTaskElementState(this.task, true);

    let idIndex = this.removedTasks.indexOf(this.task);
    this.removedTasks.splice(idIndex, 1);
    this.set('task', undefined);
  }

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Protected API */

  //Empty

  /* ------------------------------------------------------------------------------------------------------------ */
  /* Private API */

  __blurInput() {
    this.shadowRoot.querySelector('#addTaskTitleInput').value = null;
  }

  /**
   * Delete task.
   * @see https://developers.google.com/tasks/v1/reference/tasks/delete
   *
   * @private
   */
  __deleteTask(task) {
    clearTimeout(this.timerId);
    gapi.client.request({
      path: 'https://www.googleapis.com/tasks/v1/lists/' + this.tasklist.id + '/tasks/' + task.id,
      method: 'DELETE'
    }).then(response => {
      if (response.body === "") {

        for (var removedTask of this.removedTasks) {
          this.__changeTaskElementState(removedTask, true);
        }

        let idIndex = this.removedTasks.indexOf(task);
        this.removedTasks.splice(idIndex, 1);

        let index = this.tasks.indexOf(task);
        this.splice('tasks', index, 1);

        if (!task.completed) {
          this.shadowRoot.querySelector('#nonCompletedTaskList').render();
        } else {
          this.shadowRoot.querySelector('#completedTaskList').render();
        }

        for (var removedTask of this.removedTasks) {
          this.__changeTaskElementState(removedTask, false);
        }

        if (this.removedTasks.length === 0) {
          this.set('task', undefined);
        }

        this.set('shouldReloadTaskCount', true);
      }
    });
  }

  /**
   * Change task element(row) hidden state
   *
   * @private
   */
  __changeTaskElementState(task, isHidden) {
    var taskElement;
    if (!task.completed) {
      taskElement = this.shadowRoot.querySelector('#task-id-' + task.id);
    } else {
      taskElement = this.shadowRoot.querySelector('#completed-task-id-' + task.id)
    }

    if (taskElement !== null) {
      isHidden ? taskElement.unhideTask() : taskElement.hideTask();
    }
  }

  /**
   * Return completed tasks
   *
   * @private
   */
  __filterCompletedTasks(task) {
    return task.completed;
  }

  /**
   * Return non completed tasks
   *
   * @private
   */
  __filterNonCompletedTasks(task) {
    return !task.completed;
  }

  /**
   * Return sum of completed tasks
   *
   * @private
   */
  __getCompletedTaskSum(shouldReloadTaskCount) {
    this.set('shouldReloadTaskCount', false);

    if (this.tasks) {
      return this.tasks.filter(task => task.completed).length;
    } else {
      return 0;
    }
  }

  /**
   * Return icon for completed tasks, according to expand state
   *
   * @private
   */
  __getCompletedTitleIcon(showCompletedTasks) {
    return showCompletedTasks ? 'icons:expand-less' : 'icons:expand-more';
  }

  /**
   * Handle task title input.
   *
   * @private
   */
  __handleAddTaskInput() {
    let title = this.shadowRoot.querySelector('#addTaskTitleInput').value;
    if (title) {
      gapi.client.request({
        path: 'https://www.googleapis.com/tasks/v1/lists/' + this.tasklist.id + '/tasks',
        method: 'POST',
        body: {
          title: title
        }
      }).then(response => {
        if (this.tasks === undefined) {
          this.tasks = [];
        }
        this.unshift('tasks', response.result);
        this.__blurInput();
      });
    }
  }

  /**
   * Prepare task deletion in given timeout, or delete task if timeout is already running
   *
   * @private
   */
  __prepareTaskDeletion(model) {
    if (this.removedTasks === undefined) {
      this.removedTasks = [];
    }
    if (this.task !== undefined) {
      this.__deleteTask(this.task);
    }
    this.set('task', model.task);

    this.removedTasks.push(model.task);

    this.timerId = setTimeout(() => this.__deleteTask(model.task), 4000);
  }

  /**
   * Toggle task completion value.
   *
   * @private
   */
  __toggleCompletedTasks() {
    this.set('showCompletedTasks', !this.showCompletedTasks);

    if (this.showCompletedTasks && this.tasks !== undefined) {
      this.set('tasks', this.tasks.slice());
    }
  }

}

/** Register element */
window.customElements.define(GTTasklist.is, GTTasklist);
