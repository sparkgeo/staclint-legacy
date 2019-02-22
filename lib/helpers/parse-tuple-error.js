export default message => {
  return JSON.parse(
    message
      .replace(/\[|\]|, <unset>|, None|, \(\)|<ValidationError: |>/g, '')
      .replace(/, ,/g, ',')
      .replace(/^\(/, '[')
      .replace(/\)$/, ']')
  );
};
