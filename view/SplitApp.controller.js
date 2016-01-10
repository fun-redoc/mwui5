sap.ui.define(
["sap/ui/core/mvc/Controller","rsh/model/formatter"], 
function(Controller,formatter) {
  "use strict";
  return Controller.extend("rsh.view.SplitApp", {
    formatter : formatter,
    _hasActiveRequest : function(obj) {
      var val = obj.mobileWork.status;
      var res = (val === null || val === undefined || val === '' || val === 'none');
      return !res;
    },
    onInit : function() {
//      this.getView().setModel(testModel, "testModel")
// Register the view with the message manager
			//sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
     // sap.ui.getCore().attachValidationError(function (oEvent) {  
     //   console.log("on validation error")
     //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);  
     // });  
     // sap.ui.getCore().attachValidationSuccess(function (oEvent) {  
     //   console.log("on validation success")
     //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);  
     // });  			
     // sap.ui.getCore().attachFormatError(function (oEvent) {
     //   console.log("on format error")
     //   oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
     // });
     // sap.ui.getCore().attachParseError(function (oEvent) {
     //   console.log("on parse error")
     //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
     // });
    },
    _printRequest : function(callback, request) {
      var html = "<html><body><h1>Hallo World</h1></body></html>";
      var printWindow = window.open("", "", "width=600px,height=800px");
      printWindow.document.write(html);
      printWindow.print();
      printWindow.close();
    },
    onPrintOptionsPress: function(evt) {
      var self = this;
      F.Maybe(this.byId("idDetail"))
          .obind('getBindingContext', "persons")
          .bind(function(context){
            var model = context.getModel();
            var editObject = context.getObject();
            editObject = self._setObjectValuesFromEditView(editObject);
            self._printRequest(null, editObject);
          });
    },
    onOpenDialog : function() {
            this.getOwnerComponent().helloDialog.open(this.getView());
    },
    itemSelected : function(evt) {
//    var path = evt.getSource().getSelectedItem().getBindingContext("persons").getPath()
      var self = this;
      F.Maybe(evt).obind('getSource').onNothing(function() {jQuery.sap.log.error("getSource failed");})
                  .obind('getSelectedItem')
                  .obind('getBindingContext',"persons")
                  //.obind('getPath')
                  .bind(function(context) {
                    //var toDetailId   = self.getView().byId('idDetail')
                    F.Maybe(context)
                        .obind('getPath')
                        .bind(function(path){
                            F.Maybe(self.getView().byId("idDetail"))
                                .obind('bindElement', {path:path, model:"persons"})
                                .bind(function(){
                                  F.Maybe(self).obind('getView').obind('byId',"idDetail")
                                               .bind( function(detailView) {
                                                  F.Maybe(self.byId("app"))
                                                      .obind('toDetail', detailView, 'slide' )
                                                      .bind(function() {
                                                        var obj = context.getObject();
                                                        self._toViewMode(self._hasActiveRequest(obj));
                                                      });
                                               });
                                });
                        });
                  }).onNothing(function() { jQuery.sap.log.error("failed to show selected element", evt);});
    },
    _allButtonsInvisible : function() {
      var buttonIds = ["idExtend", "idNew", "idSave", "idCancel"];
      this._visibleById(false, buttonIds);
    },
    _visibleById : function(bool, buttonIds) {
      var self = this;
      buttonIds.map(function(id) {
        F.Maybe(self.getView().byId(id))
            .obind('setVisible', bool);
      });
    },
    _deepCopy : function(obj) {
      return jQuery.extend(true, {}, obj);
    },
    _today : function() {
      var result = new Date(Date.now());
      result.setHours(0);
      result.setMinutes(0);
      result.setSeconds(0);
      result.setMilliseconds(0);
      return result;
    },
    _sixMonthsLater : function(date) {
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDate();
      var monthPlusSix = month + 6;
      var resultingYear = year;
      if( monthPlusSix > 11 ) { // month is 0 based
        monthPlusSix = monthPlusSix - 11;
        resultingYear = year + 1;
      }
      // TODO, check if 29.08.2016  + 6 monath is  1.03.2017
      var result = new Date(resultingYear, monthPlusSix,day);
      return result;
    },
    _prepareForEdit : function(obj) {
      if( obj === null || obj === undefined ) return obj;
      obj.mobileWork.status = 'requested';
      obj.mobileWork.beginDate = this._today();
      obj.mobileWork.endDate = this._sixMonthsLater(obj.mobileWork.beginDate);
      obj.mobileWork.workHoursPerWeek = obj.maxWorkhoursPerWeek;
      //console.assert(this._sixMonthsLater(new Date(2016,7,29)) === (new Date(2017,3,1)))
      // TODO prepare options
      return obj;
    },
    _toEditMode : function() {
      this._allButtonsInvisible();
      this._visibleById(true,["idSave", "idCancel", "idFormRequestEdit", "idFormRequestOptionsEdit"]);
    },
    _toViewMode : function(fRequest) {
      this._allButtonsInvisible();
      this._visibleById(false,["idFormRequestEdit", "idFormRequestOptionsEdit"]);
      this._visibleById(!fRequest,["idNew"]);
      this._visibleById(fRequest,["idFormRequest"]);
      this._visibleById(fRequest,["idFormRequestOptions"]);
    },
    _toNoneMode : function() {
      this._allButtonsInvisible();
      this._visibleById(false,["idFormRequestEdit", "idFormRequestOptionsEdit"]);
      this._visibleById(false,["idFormRequest", "idFormRequestOptions"]);
      this._visibleById(true,["idNew"]);
    },
    onNewPress : function(evt) {
      var self = this;
      F.Maybe(this.byId("idDetail"))
          .obind('getBindingContext', "persons")
          //.obind('getObject')
          .bind(function(context) {
            // idea: bind a copy of the object to the edit view
            F.Maybe(context)
                .obind('getObject')
                .bind(function(obj){
                  var editObject = self._prepareForEdit(self._deepCopy(obj));
                  self._setEditViewValuesFromObject(editObject);
                  self._toEditMode();
                });
          }).onNothing(function() { jQuery.sap.log.error("onPress: failed to determin context");});
    },
    _setEditViewValuesFromObject : function(obj) {
      this.byId("idBeginDate").setDateValue(obj.mobileWork.beginDate);
      this.byId("idEndDate").setDateValue(obj.mobileWork.endDate);
      this.byId("idWorkHoursPerWeek").setValue(obj.mobileWork.workHoursPerWeek);
    },
    _setObjectValuesFromEditView : function(origObj) {
      var obj = this._deepCopy(origObj);
      obj.mobileWork.beginDate = this.byId("idBeginDate").getDateValue();
      obj.mobileWork.endDate = this.byId("idEndDate").getDateValue();
      obj.mobileWork.workHoursPerWeek = this.byId("idWorkHoursPerWeek").getValue();
      return obj;
    },
    _successCallback : function() { console.log("success");},
    _failureCallback : function() { jQuery.sap.log.error("failure: ", arguments);},
    onSavePress : function(evt) {
      console.log("onSavePress");
      
      // TODO funktioiniert ist aber hässlich, gibt es eine bessere lösung?
      var stillHasError = false;
      jQuery('input[aria-invalid=true]').first().each(function(index,elemet){stillHasError=true;});
      if(stillHasError) return;

      var self = this;
      F.Maybe(this.byId("idDetail"))
          .obind('getBindingContext', "persons")
          .bind(function(context){
            var model = context.getModel();
            var editObject = context.getObject();
            editObject = self._setObjectValuesFromEditView(editObject);
            editObject.mobileWork.status = "requested";
            //context.getModel().setProperty(context.getPath(), editObject, context, true)
            context.getModel().update(context.getPath(), editObject, 
            		                  {context : context, 
            	                 	   success : function() { console.log("TODO success", arguments);},
            	                 	   error   : function() { console.log("TODO error", arguments);}
            		                  });
            if( model.hasPendingChanges() ) {
              console.log("pending changes");
              var res = model.submitChanges(self._successCallback, self._failureCallback);// TODO - subitChanges has  a useful ETag parameter
              // the callbacks arent called, why??
            }
            self._toViewMode(true);// refrehs is asnc
          });
    },
    onCancelPress : function() {
      //console.log("onCancelPress")
      this._allButtonsInvisible();
      this._toViewMode(false);// refrehs is asnc
    },
    onChangeX : function(evt) {
      console.log("onChangeX", evt);
//      evt.getSource().setValueState(sap.ui.core.ValueState.Error)

          evt.bCancelBubble = true; //stop bubbling to the parent control
    },
    onValidateForm : function(evt) {
     console.log("onValidateForm");
     var aFieldGroup = evt.getParameters().fieldGroupIds;
      if (aFieldGroup.indexOf("MyGroup") > -1) {
          //do validation
          evt.bCancelBubble = true; //stop bubbling to the parent control
      }
    },
    
    
    
    /**
		 * This is a custom model type for validating email
		 */
		typeHours : sap.ui.model.odata.type.Decimal.extend("rsh.model.TypeHours", {
			formatValue: function (oValue) {
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
		})
  });
});
