export default element =>
  !element.style.display || element.style.display === 'none'
    ? (element.style.display = 'block')
    : (element.style.display = 'none');
