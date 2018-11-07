const getValidationErrors = ({
  valid_stac,
  error_message,
  children,
  path
} = {}) => {
  // Used for recursive calls. The first call of this function is going to be true.
  if (valid_stac) {
    return;
  }
  const errorList = [];

  errorList.push({
    path: path || "Editor",
    msg: error_message
  });

  // Adds the responses from all recursive calls as siblings to the errorList array. Not children.
  if (children) {
    errorList.push(...[].concat(...children.map(getValidationErrors)));
  }

  return errorList;
};

export default getValidationErrors;
