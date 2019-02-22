export default path =>
  path && !path.startsWith('/tmp')
    ? `<div class="muted-text"><small>${path}</small></div>`
    : '';
