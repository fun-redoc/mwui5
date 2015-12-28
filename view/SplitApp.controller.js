sap.ui.define(
["sap/ui/core/mvc/Controller"
,"rsh/model/formatter"], 
function(Controller,formatter) {
  "use strict";
  return Controller.extend("rsh.view.SplitApp", {
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
    onOpenDialog : function() {
            this.getOwnerComponent().helloDialog.open(this.getView())
    },
    itemSelected : function(evt) {
//    var path = evt.getSource().getSelectedItem().getBindingContext("persons").getPath()
      var self = this
      F.Maybe(evt).obind('getSource')
                  .obind('getSelectedItem')
                  .obind('getBindingContext',"persons")
                  .obind('getPath')
                  .bind(function(path) {
                    var toDetailId   = self.createId('idDetail')
                    var detailsPanel = self.getView().byId("idDetail")
                    var app          = self.byId("app");
                    detailsPanel.bindElement({path:path, model:"persons"})
                    app.toDetail(toDetailId,'slide')//show, fade, slide
                  })
    }
  })
})