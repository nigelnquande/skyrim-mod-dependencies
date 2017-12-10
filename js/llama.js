function llama() {
  let tpl = {
    "schema": {
      "title":"",
      "type":"object",
      "properties": {},
      "dependencies": {}
    },
    "options" : {
      "form":{
        "attributes":{ },
        "buttons":{ }
      },
      "helper": "",
      "fields": {}
    },
    "data": { },
    "definitions": {},

    /*! Helper functions */
    "setFormTitle": function (title) { 
      this.schema.title = title;

      return this;
    },

    "getProp": function (control, id) {
      return control.childrenByPropertyId[id];
    },

    "_getDefItems": function (definition, key, item) {
      let dataArr = (this.definitions.hasOwnProperty(definition) && this.definitions[definition].hasOwnProperty(key))? this.definitions[definition][key] : {};
      let items = [];
      if (dataArr.length > 0) for (var i = 0; i < dataArr.length; i++) 
        if ((typeof dataArr[i] == "object") && dataArr[i].hasOwnProperty(item)) items.push(dataArr[i][item]);

      return items;
    },

    "getDefVals": function (definition, key) {
      return this._getDefItems(definition, key, 'value');
    },

    "getDefLabels": function (definition, key) {
      return this._getDefItems(definition, key, 'text');
    },

  /*! Attach the appropriate sorting function, based on the attributes passed in (sortParams) */
    "_sortField": function (asc, property) {
      if (["text", "value"].includes(property)) {
        if (asc) {
          return function (a, b) {
            if (a[property].toLowerCase() < b[property].toLowerCase())
              return -1;
            else if (a[property].toLowerCase() > b[property].toLowerCase())
              return 1;
            return 0;
          };
        } else {
          return function (a, b) {
            if (a[property].toLowerCase() < b[property].toLowerCase())
              return 1;
            else if (a[property].toLowerCase() > b[property].toLowerCase())
              return -1;
            return 0;
          };
        }
      } else { console.warn("`%s` is not a valid sorting property.", property); return false; }
    },

    "setPostRender": function (callback) {
      this.postRender = function (control) { callback(control); };

      return this;
    },

    "setDefinition": function (key, dataObject, extend = true) {
      if (!this.definitions.hasOwnProperty(key) || extend === false) this.definitions[key] = dataObject;
      if (extend) {
        for (var k in dataObject) if (dataObject.hasOwnProperty(k)) this.definitions[key][k] = dataObject[k];
      }

      return this;
    },

    "setFormSubmit": function (submitTitle, successCb, failureCb, rstTitle = "Reset", useAjax = true) {
      this.options.form.buttons = {
        "submit":{
          "title": submitTitle,
          "click": function() {
            let val = this.getValue();
            if (this.isValid(true)) {
              if (useAjax) this.ajaxSubmit().done(function() { successCb(val); });
              else successCb(val);
            } else { failureCb(val); }
          }
        },
        "reset": { "title": rstTitle }
      };

      return this;
    },

    "setFormHelper": function (text) {
      this.options.helper = text;

      return this;
    },

    "setFormAttributes" : function (action, method = "post") {
      let m = method.toLowerCase();
      this.options.form.attributes = { 
        "action": action, 
        "method": (["get", "post"].includes(m)) ? m : "post"
      };

      return this;
    },

    /* Generic function to add a field to the skeleton; called by specific `add{fieldType}` functions */
    "_addField": function (key, properties, options, data = "", dependencies = {}) {
      this.schema.properties[key] = properties;
      this.options.fields[key] = options;
      if (data.length > 0) this.data[key] = data;
      if ((typeof dependencies) == "object" && Object.keys(dependencies).length > 0) { 
        // a field may not depend on itself. If this is the case, skip dependencies
        if (dependencies.hasOwnProperty(key)) 
          console.error("[Violation] Field `%s` lists itself as a dependency! Dependencies for this field have not been set.", key);
        else {
          this.schema.dependencies[key] = Object.keys(dependencies);
          this.options.fields[key]["dependencies"] = dependencies;
        }
      }

      return this;
    },

    "addNameField": function (key, title, id = "", data = "", additional = {}) {
      let properties = {
        "type": "string",
        "title": title,
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
        "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
      };
      if (additional.hasOwnProperty("minLength") && additional.minLength > 0) properties.minLength = additional.minLength;
      if (additional.hasOwnProperty("maxLength") && additional.maxLength > 0) properties.maxLength = additional.maxLength;
      let fields = {
        "type": "personalname",
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key,
        "inputType": (additional.hasOwnProperty('inputType'))? additional.inputType : "text"
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (additional.hasOwnProperty('helpText')) fields.helper = additional.helpText;
      if (additional.hasOwnProperty('placeholder')) fields.placeholder = additional.placeholder;
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, data, deps);
    },

    "addTextField": function (key, title, id = "", data = "", additional = {}) {
      let properties = {
        "type": "string",
         "title": title,
         "required": (additional.hasOwnProperty('required'))? additional.required : false,
         "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
      };
      if (additional.hasOwnProperty("minLength") && additional.minLength > 0) properties["minLength"] = additional.minLength;
      if (additional.hasOwnProperty("maxLength") && additional.maxLength > 0) properties["maxLength"] = additional.maxLength;
      let fields = {
        "type": "text",
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key,
        "inputType": (additional.hasOwnProperty('inputType'))? additional.inputType : "text"
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (additional.hasOwnProperty("allowEmpty")) fields.dissallowOnlyEmptySpaces = !additional.allowEmpty;
      if (additional.hasOwnProperty("placeholder")) fields.placeholder = additional.placeholder;
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, data, deps);
    },

    "addHiddenField": function (key, id = "", data = "") {
      let properties = {
        "type": "string"
      };
      let fields = {
        "type": "text",
        "hidden": true,
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key
      };

      return this._addField(key, properties, fields, data, {});
    },

    "addSelectField" : function (key, title, optionMap, id = "", data= "", additional = {multiSelect: {}}) {
      let properties = {
        "type": "string",
        "title": title,
        "enum": Object.keys(optionMap),
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
        "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
      };
      let fields = {
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "emptySelectFirst": (additional.hasOwnProperty('selectFirst'))? additional.selectFirst : true,
        "hideNone": (additional.hasOwnProperty('hideNone'))? additional.hideNone : true,
        "id": (id.length > 0)? id : key,
        "type": "select",
        "optionLabels": Object.values(optionMap),
        "multiple": (additional.hasOwnProperty('multiple'))? additional.multiple : false,
        "name": (id.length > 0)? id : key,
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (fields.hideNone === false && additional.hasOwnProperty('noneLabel')) fields.noneLabel = additional.noneLabel;
      if (additional.hasOwnProperty('sort') && additional.sort !== false) fields["sort"] = this._sortField(additional.sort.asc, additional.sort.property);
      else fields["sort"] = false;
      if (additional.hasOwnProperty('multiSelect') && additional.multiSelect !== {}) properties.multiselect = additional.multiSelect;
      if (additional.hasOwnProperty('helpText')) fields.helper = additional.helpText;
      // if there is no default data, but both emptySelectFirst and hideNone are true, set data to the first item (value) in the map
      if (data.length === 0 && fields.emptySelectFirst && fields.hideNone && Object.keys(optionMap).length > 0) data = Object.keys(optionMap).sort()[0];
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, data, deps);
    },

    "addCheckBox": function (key, title = "", checked = false, label = "", id = "", additional = {}) {
      let properties = {
        "type": "string",
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
        "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
      };
      if (title.length > 0 ) properties["title"] = title;
      let fields = {
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "type": "checkbox",
        "multiple": false,
        "rightLabel": label,
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key,
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (additional.hasOwnProperty('helpText')) fields.helpe = additional.helpText;
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, checked, deps);
    },

    "addCheckBoxes": function (key, title, optionMap, data = [], id = "", additional = {}) {
      let properties = {
        "type": "string",
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
        "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
        "enum": Object.keys(optionMap)
      }
      if (title.length > 0 ) properties["title"] = title;
      fields = {
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "type": "checkbox",
        "multiple": true,
        "optionLabels": Object.values(optionMap),
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (additional.hasOwnProperty('helpText')) fields["helper"] = additional.helpText;
      if (additional.hasOwnProperty('sort')) fields["sort"] = this._sortField(additional.sort.asc, additional.sort.property);
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, data, deps);
    },

    "addRadio": function (key, title, optionMap, data = [], id = "", additional = {}) {
      let properties = {
        "type": "string",
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
        "readonly": (additional.hasOwnProperty('readOnly'))? additional.readOnly : false,
        "enum": Object.keys(optionMap)
      }
      if (title.length > 0 ) properties["title"] = title;
       let fields = {
        "disabled": (additional.hasOwnProperty('disabled'))? additional.disabled : false,
        "type": "radio",
        "optionLabels": Object.values(optionMap),
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key,
        "hideNone": (additional.hasOwnProperty('hideNone'))? additional.hideNone : false,
        "emptySelectFirst": (additional.hasOwnProperty('selectFirst'))? additional.selectFirst : true,
        "vertical": (additional.hasOwnProperty('vertical'))? additional.vertical : true
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (fields.hideNone === false && additional.hasOwnProperty('noneLabel')) fields.noneLabel = additional.noneLabel;
      if (additional.hasOwnProperty('helpText')) fields.helper = additional.helpText;
      if (additional.hasOwnProperty('sort') && additional.sort !== false) fields["sort"] = this._sortField(additional.sort.asc, additional.sort.property);
      else fields["sort"] = false;
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, data, deps);
    },

    "addFile": function (key, title, mustStyle = true, helpText = "", id="", additional = {}) {
      let properties = {
        "type": "string",
        "title": title,
        "format": "uri",
        "required": (additional.hasOwnProperty('required'))? additional.required : false,
      };
      let fields = {
        "type": "file",
        "styled": mustStyle,
        "id": (id.length > 0)? id : key,
        "name": (id.length > 0)? id : key,
      };
      if (additional.hasOwnProperty("classes")) fields.fieldClass = additional.classes;
      if (helpText.length > 0) fields.helper = helpText;
      let deps = additional.hasOwnProperty('dependencies') ? additional.dependencies : {};

      return this._addField(key, properties, fields, "", deps);
    }

  };

  return tpl;
}

