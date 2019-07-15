import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-styles/shadow';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="gt-styles">
  <template>
    <style>

      /* Dialog styles */
      paper-dialog { border-radius: 12px; width: 512px; }
      paper-dialog div.buttons paper-button { border-radius: 12px; font-family: var(--title-font); }
      paper-dialog div.buttons paper-button.warning { color: var(--accent-color); }
      paper-dialog div.buttons paper-button[dialog-dismiss] { color: var(--primary-text-color); }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);

;
