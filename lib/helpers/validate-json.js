const jsonlint = require('jsonlint-mod');
const lineBreaksRe = /(.*)\n(.*)\n(.*)\n(.*)/;

const validateJson = json => {
  const response = {
    valid_stac: true,
    line: '',
    error_message: '',
  };

  try {
    jsonlint.parse(json);
  } catch (error) {
    const messageGroups = error.message.match(lineBreaksRe);
    response.valid_stac = false;
    response.path = messageGroups[1];
    response.error_message = `
      ${messageGroups[2]}</span><br /><span class="code">
      ${messageGroups[3]}</span><br /><span class="code">
      =======================</span><br /><span class="code">
      ${messageGroups[4]}
    `;
  }
  return response;
};

export default validateJson;
