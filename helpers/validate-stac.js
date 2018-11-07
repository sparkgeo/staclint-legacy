import { ajax } from 'jquery';
// TODO: Environment variable
const VALIDATION_URL =
  'https://08tl0pxipc.execute-api.us-west-1.amazonaws.com/prod/stac_validator';

export default formValues => {
  const data = JSON.stringify(formValues);
  return ajax({
    type: 'POST',
    url: VALIDATION_URL,
    dataType: 'json',
    data,
  }).then(function(results) {
    return results;
  });
};
