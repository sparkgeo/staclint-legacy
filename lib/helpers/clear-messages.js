export default ({ resultsElem, resultsContainer } = {}) => {
  while (resultsElem.firstChild) {
    resultsElem.removeChild(resultsElem.firstChild);
  }
  resultsContainer.style.overflowY = 'hidden';
};
