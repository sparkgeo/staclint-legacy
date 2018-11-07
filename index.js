import $ from "jquery";
// var popper = require('popper.js');
import bootstrap from "bootstrap";
import {
  codeEditor,
  getValidationErrors,
  buildErrorMessage,
  lintJson
} from "./helpers";
require("./index.css");

var $stacUrl;
var $results;
var $validateButton;
var $validateForm;
var $stacVersions;
var $editorToggle;
var $externalUrlFormLabel;
var $editorFormLabel;
var $editorUrlInput;
var $main;
var $editor;

var jsonEditor;
var viewEditor = false;
var isValid = false;
var VALIDATING_STATE = "validating";
var VALIDATED_STATE = "validated";
var VALIDATION_URL =
  "https://08tl0pxipc.execute-api.us-west-1.amazonaws.com/prod/stac_validator";

var clearMessages = function() {
  $results.empty();
};

var enableButton = function(isEnabled) {
  isEnabled
    ? $validateButton
        .removeAttr("disabled")
        .addClass("btn-success")
        .removeClass("btn-light")
    : $validateButton
        .attr("disabled", true)
        .addClass("btn-light")
        .removeClass("btn-success");
};

var disableInputs = function(isDisabled) {
  if (isDisabled) {
    if (jsonEditor) {
      jsonEditor.setOption("readOnly", true);
    }
    $stacVersions.attr("disabled", true);
    $stacUrl.attr("disabled", true);
    return;
  }
  if (jsonEditor) {
    jsonEditor.setOption("readOnly", false);
  }
  $stacVersions.removeAttr("disabled");
  $stacUrl.removeAttr("disabled");
};

var setState = function(state) {
  if (state === VALIDATING_STATE) {
    disableInputs(true);
    enableButton(false);
    $validateForm.addClass("validated");
    $validateButton.html('<i class="fas fa-sync-alt fa-spin"></i> Validating');
  } else if (state === VALIDATED_STATE) {
    disableInputs(false);
    enableButton(true);
    $validateForm.addClass("validated");
    $validateButton.html("Revalidate");
  } else {
    disableInputs(false);
    enableButton(true);
    $validateForm.removeClass("validated");
    $validateButton.html("Validate");
  }
};

var getFormValues = function() {
  var data = {};
  var url = $stacUrl.val();
  var json;
  if (jsonEditor) {
    json = jsonEditor.getValue();
  }

  // data.schemaVersion = $stacVersions.val();
  // TODO: Add Error Message for no data provided
  if (viewEditor && json) {
    data.json = json;
  } else if (url) {
    data.url = url;
  }
  return data;
};

var displayValidationErrors = function(errors) {
  for (var i = 0; i < errors.length; i++) {
    $results.append(buildErrorMessage(errors[i]));
  }
};

var displayValidationSuccess = function() {
  var message =
    '<div class="validation-alert validation-success">' +
    '<i class="fa fa-check-circle"></i> ' +
    '<span class="response-message">No errors found. JSON is valid.</span></div>';
  $results.append(message);
};

const validate = formValues => {
  const data = JSON.stringify(formValues);
  return $.ajax({
    type: "POST",
    url: VALIDATION_URL,
    dataType: "json",
    data
  }).then(function(results) {
    return results;
  });
};

var runValidate = function(event) {
  event.preventDefault();

  setState(VALIDATING_STATE);
  clearMessages();

  var data = getFormValues();

  return validate(data)
    .then(function(results) {
      const { valid_stac, error_message, children, path } = results;

      if (valid_stac) {
        displayValidationSuccess();
      } else {
        const validationErrors = getValidationErrors({
          valid_stac,
          error_message,
          children,
          path
        });
        displayValidationErrors(validationErrors);
      }
    })
    .done(function() {
      setState(VALIDATED_STATE);
    });
};

var getVersions = function() {
  $.getJSON(
    "https://api.github.com/repos/radiantearth/stac-spec/tags",
    function(data) {
      $.each(data, function(key, val) {
        $stacVersions.append(
          $("<option />")
            .val(val.name)
            .text(val.name)
        );
      });
    }
  );
};

var onContentChange = function() {
  const { url, json } = getFormValues();
  isValid = (url != null && $validateForm[0].checkValidity()) || json != null;
  enableButton(isValid);
};

var toggleEditor = function() {
  $externalUrlFormLabel.toggle();
  $editorFormLabel.toggle();
  $editorUrlInput.toggle();
  $editor.toggle();

  $(".toggle__symbol").toggle();
  $(".toggle__arrow").toggle();

  // Used for determing what element to validate
  viewEditor = !viewEditor;
  if (viewEditor && !jsonEditor) {
    jsonEditor = codeEditor();
    jsonEditor.on("change", onContentChange);
  }
};

// Events
var bindEvents = function() {
  $validateButton.click(runValidate);
  $stacUrl.on("keypress input", onContentChange);
  $validateForm.on("submit", runValidate);
  $editorToggle.click(toggleEditor);
};

$(document).ready(function() {
  $stacUrl = $("#stacUrl");
  $results = $("#results");
  $validateButton = $("#validateButton");
  $validateForm = $("#validateForm");
  $stacVersions = $("#stacVersions");
  $editorToggle = $("#editorToggle");
  $externalUrlFormLabel = $(".form__label-external");
  $editorFormLabel = $(".form__label-editor");
  $editorUrlInput = $("#stacUrl");
  $main = $("main");
  $editor = $("#editor");

  bindEvents();
});
