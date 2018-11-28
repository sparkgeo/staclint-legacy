export default ({ jsonEditor, stacVersions, stacUrl } = {}) => {
  if (jsonEditor) {
    jsonEditor.setOption('readOnly', true);
  }
  stacVersions.setAttribute('disabled', true);
  stacUrl.setAttribute('disabled', true);
};
