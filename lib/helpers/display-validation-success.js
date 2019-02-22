export default containerElem => {
  containerElem.innerHTML += `
      <div class="validation-alert validation-success">
      <i class="fa fa-check-circle"></i>
      <span class="response-message">No errors found. JSON is valid.</span></div>
    `;
};
