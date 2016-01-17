sap.ui.define(["sap/ui/core/Control"], 
  function(Control) {
    "use strict";
    return Control.extend("rsh.control.DayOption", {

      typeHours : sap.ui.model.type.String.extend("rsh.control.TypeHours", { 
        formatValue: function (oValue) {
          console.log("formatValue TypeHours");
          var hh = "";
          var mm = "";
          var res = "";
          if( !(oValue === null || oValue === undefined) && jQuery.isNumeric(oValue) ) {
            if( oValue > 0 ){
              var day = 24*60;
              var time = parseInt(oValue*60) % day;
              var imm = time % 60;
              var ihh = parseInt(time / 60);
              mm = imm.toString();
              if( mm.length === 1) { mm = "0"+mm;}
              hh = ihh.toString();
              res = hh + ":"  + mm;
            }
          }
          return res;
        },
        parseValue: function (oValue) {
          console.log("parseValue");
          //parsing step takes place before validating step, value can be alteredi
          return oValue;
        },
        validateValue: function (oValue) {
          console.log("validateValue");
          // The following Regex is NOT a completely correct one and only used for demonstration purposes.
          // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
          //var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
          var hourRegEx = /^[0-1]?[0-9](\:[0-6]?[0-9]?)$/;
          if (!oValue.match(hourRegEx)) {
            throw new sap.ui.model.SimpleTypeValidateException("'" + oValue + "' is not a valid ");
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
                                    available : {type:"boolean", defaultValue:false},
                                    hours     : {type:"rsh.control.TypeHours", defaultValue:""},
                                    complete  : {type:"boolean", defaultValue:false},
                                    editable : {type:"boolean", defaultValue:false},
//                                    options : {type:"object"} // properties can not be structures
                                  },
                    aggregations: { _contentPane: {typa:"sap.ui.layout.Grid", multiple:false, visibility:"hidden"}},
                    events      : {change : {parameters: {value : {type : "object"}}}}
                 },
      setHours : function(val) {
          var hours = new this.typeHours();
          this.setProperty("hours", hours.formatValue(val));
      },
      getHours : function() {
        var hours = this.getProperty("hours");
        var arr = hours.split(":");
        return parseInt(arr[0]) + Math.round(parseInt(arr[1])*100/60)/100;
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
                                          //selected:this.getOptions().available,
                                          select:this._onSelectDayAvailable.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L1 M1 S7"})]
                                        }),
                                        new sap.m.Label(this.getId()+"-idLabalDeviantHours",{
                                          text:"{i18n>deviantHours}",
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5", linebreakS:true, indentS:2})]
                                        }).addStyleClass("sapUiSmallMarginTop").addStyleClass("sapUiSmallMarginBottom"),
                                        new sap.m.Input(this.getId()+"-idDeviantHours",{
                                          //value:this.getOptions().deviantHours,
                                          valueStateText:"{i18n>invalidHoursFormat}",
                                          enabled:false,
                                          change:this._onChange.bind(this),
                                          liveChange:this._onLiveChange.bind(this),
                                          //type:this.typeHours,
                                          layoutData:[ new sap.ui.layout.GridData({span:"L2 M2 S5"})]
                                        }),
                                        new sap.m.CheckBox(this.getId()+"-idCompleteDay", {
                                          text:"{i18n>completeDay}",
                                          enabled:false,
                                          //selected:this.getOptions().completeDay,
                                          select:this._onSelectCompleteDay.bind(this),
                                          layoutData:[ new sap.ui.layout.GridData({span:"L3 M3 S10", linebreakS:true, indentS:2})]
                                        })
                                     ]
                    });
                    this.setAggregation("_contentPane", grid);
                    this._states.initial();
                    console.log("language", sap.ui.getCore().getConfiguration().getLanguage());
                 },
      _setViewValues : function(control) {
        var self = control;
        F.Maybe(sap.ui.getCore().byId(self.getId()+"-idDay"))
          .bind(function(label) { label.setText(self.getDay()); });
        F.Maybe(sap.ui.getCore().byId(self.getId()+"-idAvailable"))
          .bind(function(checkBox) { checkBox.setSelected(self.getAvailable()); });
        F.Maybe(sap.ui.getCore().byId(self.getId()+"-idDeviantHours"))
          .bind(function(input) { input.setValue(self.getProperty("hours")); });
          //.bind(function(input) { input.setValue(self.getHours()); });
        F.Maybe(sap.ui.getCore().byId(self.getId()+"-idCompleteDay"))
          .bind(function(checkBox) { checkBox.setSelected(self.getComplete()); });
      },
      renderer : function(renderManager, control) {
                   console.log("render", control);
                   control._setViewValues(control);
                    F.Maybe(control.getAggregation("_contentPane"))
                        .obind('getContent')
                        .obind('map', function(innerControl) {if(innerControl.setEditable) {innerControl.setEditable(control.getEditable());}});
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
//                var regex  = /^[0-1]?[0-9]?(\.[0-9]?[0-9]?|$)$/;
                var regex  = /^(([0-9]?|10)(:[0-9]{2}))?$/;
                if (!value.match(regex)) {
                  //throw new sap.ui.model.SimpleTypeValidateException("'" + oValue + "' is not valid.");
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
