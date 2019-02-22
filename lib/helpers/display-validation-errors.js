import { buildErrorMessage } from '.';

export default ({ errors, resultsElem, resultsContainer } = {}) => {
  for (var i = 0; i < errors.length; i++) {
    resultsElem.innerHTML += buildErrorMessage(errors[i]);
  }
  resultsContainer.style.overflowY = 'scroll';
};
