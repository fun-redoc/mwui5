sap.ui.jsview("rsh.view.Main",
{
  /** 
   * @memberOf rsh.view.Main
   */
  getControllerName : function() { return "rsh.view.Main" },
  
  /**
   * function that creates the view content
   * @memberOf rsh.view.Main
   */
   createContent : function( controller ) {
     return new sap.m.Page({
       title : "{i18n>detailPageContent}",
       content : [
         new sap.ui.commons.TextView({ text : "Selet Row in the master left to see a Detail Page",
                                       design : sap.ui.commons.TextViewDesign.H5 })
       ]
     })
   }
})