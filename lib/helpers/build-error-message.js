// Note: A lot of this regex-hunting is due to stac-validator API returning a stringified python tuple in place of proper JSON
// Once that is cleaned, these methods can go away.

const parseTupleError = message => {
  return JSON.parse(
    message
      .replace(/\[|\]|, <unset>|, None|, \(\)|<ValidationError: |>/g, '')
      .replace(/, ,/g, ',')
      .replace(/^\(/, '[')
      .replace(/\)$/, ']')
  );
};

const mutedPath = path =>
  path && !path.startsWith('/tmp')
    ? `<div class="muted-text"><small>${path}</small></div>`
    : '';

const checkTupleRe = /^\(.*\)$/;
const checkArrayErrorRe = /is not of type 'array'/;

// Does the API return a stringified python tuple?
const tupleFormattedError = message => message.match(checkTupleRe);

const setProperMessage = message => {
  if (tupleFormattedError(message)) {
    if (message.match(checkArrayErrorRe)) {
      return "'collection' is not of type 'Array'";
    }
    const parsedError = parseTupleError(message);
    if (parsedError.length > 1) {
      return parsedError
        .map(i => `${i}</span><br /><span class="code">`)
        .join('')
        .replace(/<\/span><br \/><span class="code">$/, '');
    }

    return parsedError;
  } else {
    return message;
  }
};

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
