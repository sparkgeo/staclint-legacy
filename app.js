require('./app.css');
var $ = require('jquery');
var popper = require('popper.js');
var bootstrap = require('bootstrap');
var CodeMirror = require('codemirror');
var $stacUrl;
var $results;
var $validateButton;
var $validateForm;
var $stacVersions;

var isValid = false;
var VALIDATING_STATE = 'validating';
var VALIDATED_STATE = 'validated';

var jsonEditor = CodeMirror(document.getElementById('editor'), {
  value: "",
  mode: "json",
  lineNumbers: true,
  theme: 'darcula'
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
    $validateButton.html('<i class="fas fa-sync-alt"></i> Validating');
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
  var message = '<div class="validation-alert  validation-error">' +
    '<i class="fa fa-exclamation-circle"></i> ' +
    '<span>' + msg + '</span></div>';
  $results.append(message);
};

var validate = function () {
  var errors = [{
      "asset_type": "catalog",
      "valid_stac": false,
      "error": "'name' is a required property of []",
      "children": [],
      "path": "tests/test_data/nested_catalogs/999/invalid_catalog.json"
    },
    {
      "asset_type": "item",
      "valid_stac": false,
      "error": "'href' is a required property",
      "children": [],
      "path": "tests/test_data/nested_catalogs/999/invalid_catalog.json"
    }
  ];
  var deferred = $.Deferred();
  setTimeout(function () {
    deferred.resolve(errors);
  }, 3000);
  return deferred.promise();
};

var getFormValues = function () {
  var data = {};
  data.schemaVersion = $stacVersions.val();
  var url = $stacUrl.val();
  var json = jsonEditor.getValue();
  if (url.length === 0 && json.length > 0) {
    data.json = json;
  } else if (url.length > 0) {
    data.url = url;
  }
  return data;
};

var displayValidationErrors = function(errors) {
  for (var i = 0; i < errors.length; i++) {
    var item = errors[i];
    addErrorMessage(item.error);
  }
}

var displayValidationSuccess = function() {
  var message = '<div class="validation-alert validation-success">' +
    '<i class="fa fa-check-circle"></i> ' +
    '<span>No errors found. JSON is valid.</span></div>';
  $results.append(message);
};

var runValidate = function () {
  setState(VALIDATING_STATE);

  var data = getFormValues();
  clearMessages();
  return validate(data)
    .then(function (results) {

      if (results.length > 0) {
        displayValidationErrors(results);
      }
      else {
        displayValidationSuccess();
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
};

$(document).ready(function () {
  $stacUrl = $('#stacUrl');
  $results = $('#results');
  $validateButton = $('#validateButton');
  $validateForm = $('#validateForm');
  $stacVersions = $('#stacVersions');
  bindEvents();
});