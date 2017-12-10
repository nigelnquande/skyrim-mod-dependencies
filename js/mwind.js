/*! Use the Llama helper library to build the alpaca mod list for MW */
let modList = llama();

modList.setFormTitle("Dependency Tree").setFormHelper("You can use this form to work out which Morrowwind mods you can install, based on selected/installed dependencies.");

$(document).ready(function() {
  $("div.form-wrapper").alpaca(modList);
});