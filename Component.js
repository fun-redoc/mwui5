sap.ui.define(["sap/ui/core/UIComponent"
              ,"sap/ui/model/json/JSONModel"
              ,"sap/ui/model/resource/ResourceModel"
              ,"sap/ui/model/odata/v2/ODataModel"
              ],
 function(UIComponent, JSONModel, ResourceModel, ODataModel) {
 "use strict"    
   return UIComponent.extend( "rsh.Component" ,  {
         metadata : { //rootView : "rsh.view.App" 
                      manifest : "json"
                    }
       , init     : function () {
                       // call init of parent
                       UIComponent.prototype.init.apply(this, arguments)
                       
                       // set i18n model
                       var i18nModel = new ResourceModel({bundleName:"rsh.i18n.i18n"})
                       // this.setModel(i18nModel,"i18n")
                       
//                       // set datamodei
//                       var data = { recipient : { name : i18nModel.getResourceBundle().getText("WORLD")}}
//                       var model = new JSONModel(data)
//                       this.setModel(model)
                       
                       // create views based on url / hash
                       // this.getRouter().initialize()
                    } 
       }) 
 })