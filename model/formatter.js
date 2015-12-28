sap.ui.define([], function() {
    "use strict";
    return {
        statusText : function( status ) {
            //var resourceBundle = this.getView().getModel("i18n").getResourceBundle()
            var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle()
            switch (status) {
                case 'A': return resourceBundle.getText("invoiceStatusA"); break;
                case 'B': return resourceBundle.getText("invoiceStatusB"); break;
                case 'C': return resourceBundle.getText("invoiceStatusC"); break;
                case 'requested': return resourceBundle.getText("requestStatus-Requested"); break;
                case 'none':      return resourceBundle.getText("requestStatus-None"); break;
                case 'granted':   return resourceBundle.getText("requestStatus-Granted"); break;
                default:
                  console.log("status not found" + status)
                    return status
            }
        }
    }
})