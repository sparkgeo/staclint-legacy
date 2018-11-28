export default ({ jsonEditor, stacVersions, stacUrl } = {}) => {
  if (jsonEditor) {
    jsonEditor.setOption('readOnly', false);
  }
  stacVersions.removeAttribute('disabled');
  stacUrl.removeAttribute('disabled');
};
