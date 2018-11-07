const mutedPath = path =>
  path && !path.startsWith('/tmp')
    ? `<div class="muted-text"><small>${path}</small></div>`
    : '';

// TODO: This will require expansion to other potential cases and a if/else method
const setProperMessage = message =>
  message.match(/is not of type 'array'/)
    ? "'collection' is not of type 'Array'"
    : message;

const buildErrorMessage = ({ path, msg } = {}) => `
  <div class="validation-alert validation-error">
    <div class="icon-container"><i class="fa fa-exclamation-circle"></i></div>
    <div class="copy-container">
      <span class="response-message"><span class="code">${setProperMessage(
        msg
      )}</span></span>
      ${mutedPath(path)}
    </div>
  </div>
`;

export default buildErrorMessage;
