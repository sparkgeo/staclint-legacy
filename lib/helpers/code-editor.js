import CodeMirror from "codemirror";
require("codemirror/mode/javascript/javascript");

var codeEditor = () =>
  CodeMirror(document.getElementById("editor"), {
    mode: "application/json",
    indentUnit: 2,
    scrollbarStyle: "native",
    lineWrapping: true,
    styleSelectedText: true,
    indentWithTabs: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    value: "\n\n\n\n\n\n\n\n\n\n\n",
    lineNumbers: true,
    theme: "blackboard"
  });

export default codeEditor;
