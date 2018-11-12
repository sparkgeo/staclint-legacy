export default ({ enable, validateButton } = {}) => {
  if (enable) {
    validateButton.removeAttribute('disabled');
    validateButton.classList.add('btn-success');
    validateButton.classList.remove('btn-light');
  } else {
    validateButton.setAttribute('disabled', true);
    validateButton.classList.add('btn-light');
    validateButton.classList.remove('btn-success');
  }
};
