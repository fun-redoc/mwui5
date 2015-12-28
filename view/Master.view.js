sap.ui.jsview("rsh.view.Master", {
//sap.ui.define(
//["sap/ui/core/mvc/JSView","rsh/model/formatter"],
//function(JSView,formatter)  {
// "use strict";
// 
//  return JSView.extend("rsh.view.Master", {
  /** 
   * @memberOf rsh.view.Master
   */
  getControllerName : function() { return "rsh.view.Master" },
  
  /**
   * function that creates the view content
   * @memberOf rsh.view.Master
   */
   createContent : function( controller ) {
     
     var listView = new sap.m.List({
       id : "idMasterList",
       mode : sap.m.ListMode.SingleSelect,
       select : function(evt) {
         controller.itemSelected(evt.getSource())
       }
     })
     
     var listItemTamplate = new sap.m.StandardListItem({
       id : "idListItem",
       title : "{persons>lastName}, {persons>firstName}",
       description : {path:'persons>status', formatter:controller.formatter.statusText.bind(controller) }
       //description : "{path:'persons>status', formatter:'.formatter.statusText' }"
     })
     
     listView.bindAggregation("items","persons>/", listItemTamplate)
     
     return new sap.m.Page({
       title : "{i18n>masterPageContent}",
       content : [listView]
     })
   }
//  })
})