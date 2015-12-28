sap.ui.define(
["sap/ui/core/mvc/Controller"
,"rsh/model/formatter"], 
function(Controller,formatter) {
  "use strict";
  return Controller.extend("rsh.view.SplitApp", {
    formatter : formatter,
    onInit : function() {
      var testModel = new sap.ui.model.json.JSONModel(
        [ { pernr : "986883", firstName : "Roland",  lastName : "Stellmach", status : "requested", startDate : "2015-12-24", endDate : "2016-06-24" }
        , { pernr : "986883", firstName : "Sophie",  lastName : "Stellmach", status : "granted"  , startDate : "2015-11-24", endDate : "2016-05-24" }
        , { pernr : "986883", firstName : "Options", lastName : "With",      status : "granted"  , startDate : "2015-11-24", endDate : "2016-05-24" , options : { text : "hallo 1"} }
        , { pernr : "986883", firstName : "Options", lastName : "With2",     status : "granted"  , startDate : "2015-11-24", endDate : "2016-05-24" , options : { text : "hallo "} }
        , { pernr : "986883", firstName : "Natalie", lastName : "Stellmach", status : "none" }
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
      F.Maybe(evt).obind('getSource').onNothing(function() {jQuery.sap.log.error("getSource failed")})
                  .obind('getSelectedItem')
                  .obind('getBindingContext',"persons")
                  //.obind('getPath')
                  .bind(function(context) {
                    var toDetailId   = self.getView().byId('idDetail')
                    var path = context.getPath()
                    F.Maybe(self.getView().byId("idDetail"))
                        .obind('bindElement', {path:path, model:"persons"})
                        .bind(function(){
                          F.Maybe(self).obind('getView').obind('byId',"idDetail")
                                       .bind( function(detailView) {
                                          F.Maybe(self.byId("app"))
                                              .obind('toDetail', detailView, 'slide' )
                                              .bind(function() {
                                                var obj = context.getObject()
                                                F.Maybe(self.getView().byId("idFormRequest")).obind('setVisible', obj.status !== 'none')
                                                F.Maybe(self.getView().byId("idFormRequestOptions")).obind('setVisible', obj.status !== 'none')
                                                F.Maybe(self.getView().byId("idNew"))
                                                    .bind(function(button){
                                                      button.setVisible(obj.status === 'none')
                                                    })
                                              })
                                       })
                        })
                    //detailsPanel.bindElement({path:path, model:"persons"})
                    //var app          = self.byId("app");
                    //app.toDetail(toDetailId,'slide')//show, fade, slide
                  }).onNothing(function() { jQuery.sap.log.error("failed to show selected element", evt)})
    }
  })
})