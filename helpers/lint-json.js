// const jsonlint = require("jsonlint-mod");
const jsonlint = require("jsonlint");

const lintJson = json => {
  const response = {
    valid: true,
    line: "",
    message: ""
  };

  try {
    jsonlint.parse(json);
  } catch (err) {
    response.valid = false;
    console.error(err);
    console.error(err.message);
  }

  return response;
};

export default lintJson;
