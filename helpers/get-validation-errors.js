const getValidationErrors = ({
  valid_stac,
  error_message,
  children,
  path
} = {}) => {
  // Used for recursive calls
  if (valid_stac) {
    return;
  }
  const errorList = [];

  errorList.push({
    path: path || "Editor",
    msg: error_message
  });

  if (children) {
    errorList.push(...[].concat(...children.map(getValidationErrors)));
  }

  return errorList;
};

export default getValidationErrors;
