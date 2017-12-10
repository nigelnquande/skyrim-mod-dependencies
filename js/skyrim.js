/*! Use the llama form helper to build the schema for Skyrim dependencies */
let modList = llama();

modList.setFormTitle("Dependency Tree").setFormHelper("You can use this form to work out which Skyrim standard/Special Edition mods you can install, based on selected/installed dependencies.");

$(document).ready(function() {
  $("div.form-wrapper").alpaca(modList);
});