import {
  codeEditor,
  getValidationErrors,
  buildErrorMessage,
  validateJson,
  validateStac,
  getStacVersions,
  toggle,
  displayValidationSuccess,
  enableInputs,
  disableInputs,
} from './helpers';
require('./index.css');

document.addEventListener('DOMContentLoaded', event => {
  let jsonEditor;
  let viewEditor = false;
  let isValid = false;
  const VALIDATING_STATE = 'validating';
  const VALIDATED_STATE = 'validated';

  // Dom elements used for manipulation
  const editor = document.querySelector('#editor');
  const formLabel = document.querySelector('.form__label');
  const defaultStacVersion = document.querySelector('#defaultStacVersion');
  const editorToggle = document.querySelector('#editorToggle');
  const resultsContainer = document.querySelector('.results-container');
  const resultsElem = document.querySelector('#results');
  const stacUrl = document.querySelector('#stacUrl');
  const stacVersions = document.querySelector('#stacVersions');
  const toggleArrow = document.querySelector('.toggle__arrow');
  const toggleSymbol = document.querySelector('.toggle__symbol');
  const validateButton = document.querySelector('#validateButton');
  const validateForm = document.querySelector('#validateForm');

  const clearMessages = function() {
    while (resultsElem.firstChild) {
      resultsElem.removeChild(resultsElem.firstChild);
    }
    resultsContainer.style.overflowY = 'hidden';
  };

  const enableButton = isEnabled => {
    if (isEnabled) {
      validateButton.removeAttribute('disabled');
      validateButton.classList.add('btn-success');
      validateButton.classList.remove('btn-light');
    } else {
      validateButton.setAttribute('disabled', true);
      validateButton.classList.add('btn-light');
      validateButton.classList.remove('btn-success');
    }
  };

  const setState = state => {
    if (state === VALIDATING_STATE) {
      disableInputs({ jsonEditor, stacVersions, stacUrl });
      enableButton(false);
      validateForm.classList.add('validated');
      validateButton.innerHTML =
        '<i class="fas fa-sync-alt fa-spin"></i> Validating';
    } else if (state === VALIDATED_STATE) {
      enableInputs({ jsonEditor, stacVersions, stacUrl });
      enableButton(true);
      validateForm.classList.add('validated');
      validateButton.innerHTML = 'Revalidate';
    } else {
      enableInputs({ jsonEditor, stacVersions, stacUrl });
      enableButton(true);
      validateForm.classList.remove('validated');
      validateButton.innerHTML = 'Validate';
    }
  };

  const getFormValues = () => {
    const data = {
      schemaVersion: stacVersions.options[stacVersions.selectedIndex].value,
    };

    const url = stacUrl.value;
    let json;

    if (jsonEditor) {
      json = jsonEditor.getValue();
    }

    // TODO: Add Error Message for no data provided
    if (viewEditor && json) {
      data.json = json;
    } else if (url) {
      data.url = url;
    }

    return data;
  };

  const displayValidationErrors = errors => {
    for (var i = 0; i < errors.length; i++) {
      resultsElem.innerHTML += buildErrorMessage(errors[i]);
    }
    resultsContainer.style.overflowY = 'scroll';
  };

  const runValidate = event => {
    event.preventDefault();

    setState(VALIDATING_STATE);
    clearMessages();

    const data = getFormValues();
    let validateJsonResponse;

    const { json } = data;
    if (json) {
      validateJsonResponse = validateJson(json);
      if (validateJsonResponse.valid_stac) {
        data.json = JSON.parse(data.json);
      } else {
        const jsonError = getValidationErrors(validateJsonResponse);
        displayValidationErrors(jsonError);
        setState(VALIDATED_STATE);
        return;
      }
    }

    validateStac(data)
      .then(results => {
        if (results.errorMessage) {
          throw results;
        }
        const { valid_stac, error_message, children, path } = results;

        if (valid_stac) {
          displayValidationSuccess(resultsElem);
        } else {
          const validationErrors = getValidationErrors({
            valid_stac,
            error_message,
            children,
            path,
          });
          displayValidationErrors(validationErrors);
        }
      })
      .catch(error => {
        console.error('Server response error -> ', error);

        if (error.status === 0 || error.status === 504) {
          displayValidationErrors(
            getValidationErrors({
              valid_stac: false,
              error_message: `
              The server timed out likely because the catalog is too large.
              </span><br /><span class="code">
              For larger catalogs, you can run this validator locally.
              </span><br /><span class="code">
              <a href="https://github.com/sparkgeo/stac-validator">https://github.com/sparkgeo/stac-validator</a>
            `,
              path: '',
            })
          );
        } else if (error.errorMessage) {
          displayValidationErrors(
            getValidationErrors({
              valid_stac: false,
              error_message: error.errorMessage,
              path: error.path || '',
            })
          );
        } else {
          displayValidationErrors(
            getValidationErrors({
              valid_stac: false,
              error_message: `
              An unexpected error occurred. Please try again.
              </span><br /><span class="code">
              If the problem persists, you can report errors on our Github repo.
              </span><br /><span class="code">
              <a href="https://github.com/sparkgeo/staclint">https://github.com/sparkgeo/staclint</a>
            `,
              path: '',
            })
          );
        }
      })
      .done(() => {
        setState(VALIDATED_STATE);
      });
  };

  const onContentChange = () => {
    const { url, json } = getFormValues();
    isValid = (url != null && validateForm[0].checkValidity()) || json != null;
    enableButton(isValid);
  };

  const toggleEditor = () => {
    toggle(editor);
    toggle(toggleSymbol);
    toggle(stacUrl);

    if (toggleArrow.innerHTML === '▸') {
      toggleArrow.innerHTML = '◂';
      formLabel.innerHTML = 'Paste your code on the left to validate';
    } else {
      toggleArrow.innerHTML = '▸';
      formLabel.innerHTML = 'Provide an external URL to validate';
    }

    viewEditor = !viewEditor;
    if (viewEditor && !jsonEditor) {
      jsonEditor = codeEditor();
      jsonEditor.on('change', onContentChange);
    }
  };

  // Events
  const bindEvents = () => {
    validateButton.onclick = runValidate;
    stacUrl.oninput = onContentChange;
    stacUrl.onkeypress = onContentChange;
    validateForm.onsubmit = runValidate;
    editorToggle.onclick = toggleEditor;
  };

  const loadStacVersions = () => {
    getStacVersions()
      .then(data => {
        data.forEach(
          i =>
            (stacVersions.options[stacVersions.options.length] = new Option(
              i.name,
              i.value
            ))
        );
        defaultStacVersion.parentNode.removeChild(defaultStacVersion);
      })
      .catch(console.error);
  };

  bindEvents();
  loadStacVersions();
});
