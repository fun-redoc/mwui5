

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
      _setViewState : function(hoursEnabled, compleDayEnabled) {
        var hoursInput          = sap.ui.getCore().byId(this.getId()+"-idDeviantHours");
        //var hoursInputLabel     = sap.ui.getCore().byId(this.getId()+"-idLabelDeviantHours");
        var completeDayCheckBox = sap.ui.getCore().byId(this.getId()+"-idCompleteDay");

        hoursInput.setEnabled(hoursEnabled);
        //hoursInputLabel.setEnabled(hoursEnabled);
        completeDayCheckBox.setEnabled(compleDayEnabled);
      },
      metadata : {
                    properties : { day     : {type:"string"},
                                    options : {type:"object", defaultValue:{ available:false, completeDay:false, deviantHours:"" }}
                                  },
                    aggregations: { _contentPane: {typa:"sap.ui.layout.Grid", multiple:false, visibility:"hidden"}},
                                events      : {change : {parameters: {value : {type : "object"}}}}
                 },
      init     : function() {

                    this._states = {
                      initial : this._setViewState.bind(this, false, false),
                      available : this._setViewState.bind(this, true, true),
                      completeDay : this._setViewState.bind(this, false, true),
                      hours: this._setViewState.bind(this, true, false)
                    };
                    
                    var grid = new sap.ui.layout.Grid({
                                     defaultSpan:"L12 M12 S12",
                                     width:"auto",
                                     content:[
                                        new sap.m.Label(this.getId()+"-idDay",{
                                          text:this.getDay(),
                                          textAlign:"Right",
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5"})]
                                        }).addStyleClass("sapUiSmallMarginTop").addStyleClass("sapUiSmallMarginBottom"),
                                        new sap.m.CheckBox(this.getId()+"-idAvailable",{
                                          text:"",
                                          selected:this.getOptions().available,
                                          select:this._onSelectDayAvailable.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L1 M1 S7"})]
                                        }),
                                        new sap.m.Label(this.getId()+"-idLabalDeviantHours",{
                                          text:"{i18n>deviantHours}",
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5", linebreakS:true, indentS:2})]
                                        }).addStyleClass("sapUiSmallMarginTop").addStyleClass("sapUiSmallMarginBottom"),
                                        new sap.m.Input(this.getId()+"-idDeviantHours",{
                                          value:this.getOptions().deviantHours,
                                          enabled:false,
                                          change:this._onChange.bind(this),
                                          liveChange:this._onLiveChange.bind(this),
                                          //type:this.typeHours,
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5"})]
                                        }),
                                        new sap.m.CheckBox(this.getId()+"-idCompleteDay", {
                                          text:"{i18n>completeDay}",
                                          enabled:false,
                                          selected:this.getOptions().completeDay,
                                          select:this._onSelectCompleteDay.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L3 M3 S10", linebreakS:true, indentS:2})]
                                        })
                                     ]
                    });
                    this.setAggregation("_contentPane", grid);
                    this._states.initial();
                    console.log("language", sap.ui.getCore().getConfiguration().getLanguage());
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
      _onLiveChange : function(evt) {
        var self = this;
        console.log("_onLiveChange");
        F.Maybe(evt)
          .obind('getSource')
          .bind(function(source) {
            F.Maybe(source)
              .obind('getParameters')
              .obind('getValue')
              .bind(function(value) {
                if(value.length > 0 ) { self._states.hours(); } else { self._states.available(); }
                var regex  = /^[0-1]?[0-9]?(\.[0-9]?[0-9]?|$)$/;
                if (!value.match(regex)) {
                  //throw new sap.ui.model.SimpleTypeValidateException("'" + oValue + "' is not a valid email address");
                  source.setValueState(sap.ui.core.ValueState.Error);
                } else {
                  source.setValueState(sap.ui.core.ValueState.None);
                }
              });
          });
      },
      _onSelectCompleteDay : function(evt) {
        var self = this;
        console.log("_onSelectCompleteDay");
        F.Maybe(evt)
          .obind('getSource')
          .obind('getSelected')
          .bind(function(isSelected) {
            console.log(isSelected);
            if(isSelected) { self._states.completeDay(); } else { self._states.available(); }
          });
      },
    _onSelectDayAvailable : function(evt) {
      var self = this;
      console.log("_onSelectDayAvailable");
      F.Maybe(evt)
        .obind('getSource')
        .obind('getSelected')
        .bind(function(isSelected) {
          if(isSelected) { self._states.available();} else { self._states.initial(); }
        });
    },
    _onSelect : function(evt) {
      console.log("_onSelect", evt.getSource());
    },
      _onChange: function(evt) {
        // TODO check it value is in the given range 
        // TODO switch to next .25 mintes
        //evt.getSource().setValueState(sap.ui.core.ValueState.Error);
        //evt.cancelBubble();
        //evt.preventDefault();
     }
    });
  }
);
