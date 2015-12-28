sap.ui.define(
["sap/ui/core/mvc/Controller"
,"rsh/model/formatter"],
function(Controller,formatter) {
  "use strict";
  
  return Controller.extend("rsh.view.Master", {
    formatter : formatter,
    
    onInit : function() {
      var testModel = new sap.ui.model.json.JSONModel(
        [ { firstName : "Roland",  lastName : "Stellmach", status : "requested", startDate : "2015-12-24", endDate : "2016-06-24" }
        , { firstName : "Natalie", lastName : "Stellmach", status : "none" }
        , { firstName : "Sophie",  lastName : "Stellmach", status : "granted", startDate : "2015-11-24", endDate : "2016-05-24" }
        ]
      )
      this.getView().setModel(testModel, "persons")
    },
    
    itemSelected : function(source) {
      console.log(source)
    }
  })
})