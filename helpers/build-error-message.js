const buildErrorMessage = error => {
  const { path, msg } = error;
  var message = "";
  var error_message = msg.replace(/'(.*?)'/g, '<span class="code">$1</span>');

  message +=
    '<div class="validation-alert validation-error">' +
    '<div class="icon-container"><i class="fa fa-exclamation-circle"></i></div>' +
    '<div class="copy-container"<span class="response-message">' +
    error_message +
    "</span>";

  if (path && path.startsWith("/tmp/") === false) {
    message += '<div class="muted-text"><small>' + path + "</small></div>";
  }

  message += "</div></div>";

  return message;
};

export default buildErrorMessage;
