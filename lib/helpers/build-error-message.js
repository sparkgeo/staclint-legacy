// Note: A lot of this regex-hunting is due to stac-validator API returning a stringified python tuple in place of proper JSON
// Once that is cleaned, these methods can go away.
import { buildMutedPath, buildProperMessage } from '.';

const buildErrorMessage = ({ path, msg } = {}) => `
  <div class="validation-alert validation-error">
    <div class="icon-container"><i class="fa fa-exclamation-circle"></i></div>
    <div class="copy-container">
      <span class="response-message"><span class="code">${buildProperMessage(
    msg
  )}</span></span>
      ${buildMutedPath(path)}
    </div>
  </div>
`;

export default buildErrorMessage;
