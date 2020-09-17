import { ajax } from 'jquery';

// TODO: Environment variable
const VALIDATION_URL =
  'https://ve1ytmkwgj.execute-api.us-west-1.amazonaws.com/dev/stac_validator_dev';
// 'https://3bg1ese1hg.execute-api.us-east-1.amazonaws.com/prod/validate';

export default formValues => {
  const data = JSON.stringify(formValues);
  return ajax({
    type: 'POST',
    url: VALIDATION_URL,
    dataType: 'json',
    data,
  }).then(function (results) {
    return results;
  });
};
