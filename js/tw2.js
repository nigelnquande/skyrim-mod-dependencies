let modList = llama();

modList.setFormTitle("Dependency Tree").setFormHelper("You can use this form to work out which Witcher II mods you can install, based on selected/installed dependencies.");

$(document).ready(function() {
  $("div.form-wrapper").alpaca(modList);
});