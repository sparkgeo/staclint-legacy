require('./app.css');
var $ = require('jquery');
var popper = require('popper.js');
var bootstrap = require('bootstrap');
var CodeMirror = require('codemirror');

var jsonEditor = CodeMirror(document.getElementById('editor'), {
  value: "{\"test\": 343}",
  mode: "json",
  lineNumbers: true,
  theme: 'darcula'
});


var validate = function () {
  $('#validateForm').addClass('validated');
};

var addErrors = function(errors) {

};



// Events
$('#validateButton').click(validate);