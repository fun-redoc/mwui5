

sap.ui.define(["sap/ui/core/Control"], 
  function(Control) {
    "use strict";
    return Control.extend("rsh.control.DayOption", {

      typeHours : sap.ui.model.type.String.extend("rsh.control.TypeHours", { formatValue: function (oValue) {
          console.log("formatValueX");
          return oValue;
        },
        parseValue: function (oValue) {
          console.log("parseValue");
          //parsing step takes place before validating step, value can be altered
          return oValue;
        },
        validateValue: function (oValue) {
          console.log("validateValue");
          // The following Regex is NOT a completely correct one and only used for demonstration purposes.
          // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
          //var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
          var hourRegEx = /^[0-4]?[0-9](\.[0-6]?[0-9]?)$/;
          if (!oValue.match(mailregex)) {
            throw new sap.ui.model.SimpleTypeValidateException("'" + oValue + "' is not a valid email address");
          }
        }
      }),
      metadata : {
                    properties : { day     : {type:"string"},
                                    options : {type:"object", defaultValue:{ available:false, completeDay:false, deviantHours:"0.0" }}
                                  },
                    aggregations: { _contentPane: {typa:"sap.ui.layout.Grid", multiple:false, visibility:"hidden"}},
                                events      : {change : {parameters: {value : {type : "object"}}}}
                 },
      init     : function() {
                    var grid = new sap.ui.layout.Grid({
                                     defaultSpan:"L12 M12 S12",
                                     width:"auto",
                                     content:[
                                        new sap.m.Label(this.getId()+"-idDay",{
                                          text:this.getDay(),
                                          textAlign:"Right",
                                          class:"sapUiSmallMarginTop sapUiSmallMarginBottom",
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5"})]
                                        }),
                                        new sap.m.CheckBox(this.getId()+"-idAvailable",{
                                          text:"",
                                          selected:this.getOptions().available,
                                          select:this._onSelect.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L1 M1 S7"})]
                                        }),
                                        new sap.m.Label(this.getId()+"-idLabalDeviantHours",{
                                          text:"{i18n>deviantHours}",
                                          class:"sapUiSmallMarginTop sapUiSmallMarginBottom",
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5", linebreakS:true, indentS:2})]
                                        }),
                                        new sap.m.Input(this.getId()+"-idDeviantHours",{
                                          value:this.getOptions().deviantHours,
                                          change:this._onChange.bind(this),
                                          //type:this.typeHours,
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5"})]
                                        }),
                                        new sap.m.CheckBox(this.getId()+"-idCompleteDay", {
                                          text:"{i18n>completeDay}",
                                          selected:this.getOptions().completeDay,
                                          select:this._onSelect.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L3 M3 S10", linebreakS:true, indentS:2})]
                                        })
                                     ]
                    });
                    this.setAggregation("_contentPane", grid);
                 },
      getDay:function() { var day = this.getProperty("day"); console.log("in getDay", day); return day; },
      renderer : function(renderManager, control) {
                    //console.log("day", control.getDay(), "day", sap.ui.getCore().byId(control.getId()+"-idDay"));
                    F.Maybe(sap.ui.getCore().byId(control.getId()+"-idDay"))
                      .bind(function(label) { label.setText(control.getDay()); });
                    renderManager.write("<div");
                    renderManager.writeControlData(control);
                    //renderManager.addClass("myCSSClass");
                    renderManager.writeClasses();
                    renderManager.write(">");
                    renderManager.renderControl(control.getAggregation("_contentPane"));
                    renderManager.write("</div>");
                 },
      _onSelect : function(evt) {
        console.log("_onSelect", evt.getSource());
      },
      _onChange: function(evt) {
        evt.getSource().setValueState(sap.ui.core.ValueState.Error);
        evt.cancelBubble();
        evt.preventDefault();
     }
    });
  }
);
