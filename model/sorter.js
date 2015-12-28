sap.ui.define([], function() {
    "use strict";
    var so = new sap.ui.model.Sorter("ExtendedPrice",false,null)
    so.fnCompare = function(a,b) {
        console.log("in compare funciton")
        if(a == b) return 0
        if(a >  b) return 1
        if(a <  b) return -1
    } 
    return so
}) 