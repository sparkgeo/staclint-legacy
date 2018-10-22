require('./app.css');
var $ = require('jquery');
var popper = require('popper.js');
var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');

var $stacUrl;
var $results;
var $validateButton;
var $validateForm;
var $stacVersions;

var isValid = false;
var VALIDATING_STATE = 'validating';
var VALIDATED_STATE = 'validated';
var VALIDATION_URL = 'https://08tl0pxipc.execute-api.us-west-1.amazonaws.com/prod/stac_validator';

var jsonEditor = CodeMirror(document.getElementById('editor'), {
  mode: 'application/json',
  indentUnit: 2,
  scrollbarStyle: 'native',
  lineWrapping: true,
  styleSelectedText: true,
  indentWithTabs: true,
  autoCloseTags: true,
  autoCloseBrackets: true,
  value: "",
  lineNumbers: true,
  theme: 'blackboard',
});

var clearMessages = function () {
  $results.empty();
};

var enableButton = function (isEnabled) {
  if (isEnabled) {
    $validateButton.removeAttr('disabled')
      .addClass('btn-success')
      .removeClass('btn-light');;
  } else {
    $validateButton.attr('disabled', true)
      .addClass('btn-light')
      .removeClass('btn-success');
  }
};

var disableInputs = function (isDisabled) {
  if (isDisabled) {
    jsonEditor.setOption('readOnly', true);
    $stacVersions.attr('disabled', true);
    $stacUrl.attr('disabled', true);
    return;
  }
  jsonEditor.setOption('readOnly', false);
  $stacVersions.removeAttr('disabled');
  $stacUrl.removeAttr('disabled');
}

var setState = function (state) {
  if (state === VALIDATING_STATE) {
    disableInputs(true);
    enableButton(false);
    $validateForm.addClass('validated');
    $validateButton.html('<i class="fas fa-sync-alt fa-spin"></i> Validating');
  } else if (state === VALIDATED_STATE) {
    disableInputs(false);
    enableButton(true);
    $validateForm.addClass('validated');
    $validateButton.html('Revalidate');
  } else {
    disableInputs(false);
    enableButton(true);
    $validateForm.removeClass('validated');
    $validateButton.html('Validate');
  }
};

var addErrorMessage = function (msg) {
  var message = '';
  var error_message = msg.error.replace(/'(.*?)'/g, '<span class="code">$1</span>');

  message += '<div class="validation-alert validation-error">' +
    '<i class="fa fa-exclamation-circle"></i> ' +
    '<span class="response-message">' + error_message + '</span>';

  if (msg.path && msg.path.startsWith('/tmp/') === false) {
    message += '<div class="muted-text"><small>' + msg.path + '</small></div>';
  }

  message += '</div>';
  $results.append(message);
};

var validate = function () {
  var values = getFormValues();
  var data = JSON.stringify(values);
  return $.ajax({
      type: 'POST',
      url: VALIDATION_URL,
      data: data,
      dataType: 'json'
    })
    .then(function (results) {
      return results;
    });
};

var getFormValues = function () {
  var data = {};
  var url = $stacUrl.val();
  var json = jsonEditor.getValue();

  // data.schemaVersion = $stacVersions.val();
  if (json) {
    data.json = json;
  } else if (url) {
    data.url = url;
  }
  return data;
};

var displayValidationErrors = function (errors) {
  for (var i = 0; i < errors.length; i++) {
    addErrorMessage(errors[i]);
  }
}

var displayValidationSuccess = function () {
  var message = '<div class="validation-alert validation-success">' +
    '<i class="fa fa-check-circle"></i> ' +
    '<span class="response-message">No errors found. JSON is valid.</span></div>';
  $results.append(message);
};

var unwrapValidationResults = function (results, output) {
  if (results.children) {
    for (var i = 0; i < results.children.length; i++) {
      var child = results.children[i];
      unwrapValidationResults(child, output);
    }
  }

  if (results.valid_stac === false) {
    output.push({
      path: results.path,
      error: results.error,
      asset_type: results.asset_type,
    });
  }
  return output;
};

var runValidate = function (event) {
  event.preventDefault();

  setState(VALIDATING_STATE);

  var data = getFormValues();
  clearMessages();
  return validate(data)
    .then(function (results) {
      var validationErrors = unwrapValidationResults(results, []);
      if (validationErrors.length === 0) {
        displayValidationSuccess();
      } else {
        displayValidationErrors(validationErrors);
      };
    })
    .done(function () {
      setState(VALIDATED_STATE);
    });
};

var onContentChange = function () {
  var data = getFormValues();
  isValid = (data.url != null && $validateForm[0].checkValidity()) || data.json != null;
  if (isValid === false) {
    enableButton(false);
  } else if (isValid === true) {
    enableButton(true);
  }
};

// Events
var bindEvents = function () {
  $validateButton.click(runValidate);
  jsonEditor.on('change', onContentChange);
  $stacUrl.on('keypress input', onContentChange);
  $validateForm.on('submit', runValidate);
};

$(document).ready(function () {
  $stacUrl = $('#stacUrl');
  $results = $('#results');
  $validateButton = $('#validateButton');
  $validateForm = $('#validateForm');
  $stacVersions = $('#stacVersions');
  bindEvents();
});
