// monad.js
// Douglas Crockford
// 2013-05-18

// Public Domain


var F = {}

F.MONAD = function(modifier) {
    'use strict';

// Each unit constructor has a monad prototype. The prototype will contain an
// is_monad property for classification, as well as all inheritable methods.

    var prototype = Object.create(null);
    prototype.is_monad = true;

// Each call to MONAD will produce a new unit constructor function.

    function unit(value) {

// Construct a new monad.

        var monad = Object.create(prototype);

// In some mythologies 'bind' is called 'pipe' or '>>='.
// The bind method will deliver the unit's value parameter to a function.

// bind takes a function and an optional array of arguments. It calls that
// function passing the monad's value and bind's optional array of args.
        if(!monad.bind) {
            monad.bind = function (func, args) {
                
                return func.apply(
                    undefined,
                    [value].concat(Array.prototype.slice.call(arguments, 1) || [])
                );
            };
        }
        if (typeof modifier === 'function') {
            value = modifier(monad, value);
        }

// Return the shiny new monad.

        return monad;
    }
    unit.method = function (name, func) {

// Add a method to the prototype.

        prototype[name] = func;
        return unit;
    };
    unit.liftValue = function (name, func) {

// Add a method to the prototype that calls bind with the func. This can be
// used for ajax methods that return values other than monads.

        prototype[name] = function () {
            return this.bind(func, arguments);
        };
        return unit;
    };
    unit.lift = function (name, func) {
        if(func === undefined) {
            func = name;
            name = func.name;
            ;
        }

// Add a method to the prototype that calls bind with the func. If the value
// returned by the func is not a monad, then make a monad.

        prototype[name] = function () {
            var result = this.bind(func, arguments);
            return result && result.is_monad === true ? result : unit(result);
        };
        return unit;
    };
    return unit;
}

F.Maybe = F.MONAD(function (monad, value) {
    if (value === null || value === undefined) {
        monad.is_null = true;
        monad.bind = function () {
            return monad;
        };
        monad.obind = function () {
            return monad
        }
    } else {
        // obind helps to bind member functions
        // obind does not fulfill the monad rules!
        monad.obind = function(func,args) {
            
            if( value === null || value === undefined ){
                return monad
            }
            var fn = value[func]
            if( fn === null || fn === undefined ) {
                return monad
            }
            // distinguish funtions that return from 
            // functions that only change the inner state of onwning obect
            // and return nil
            // in the latter case to make composition possible automatically
            // bind the old object
            var res = fn.apply(value,Array.prototype.slice.call(arguments, 1) || [])
            if( res === null || res === undefined ) {
                return F.Maybe(value)
            } else {
                return F.Maybe(res)
            }
        }
    }
    return value;
});

// Either Monad caries a default value in case a comutation(sequnece) fails
F.Either = function(left,right) {
    return {
        obind : function (func, args) {
           if( right === null || right === undefined || func === null || func === undefined || right[func] === null || right[func] === undefined ) {
               return F.Either(left,right)
           } else {
               right[func].apply(right,Array.prototype.slice.call(arguments, 1) || [])
               return F.Either(left,right)
           }
        },
        bind : function (func, args) {
           if( right === null || right === undefined ) {
               return F.Either(left, right)
           } else {
               return F.Either(left, func.apply( undefined, [right].concat(Array.prototype.slice.call(arguments, 1) || [])))
           }
        },
        value : function() {
            if( right === null || right === undefined ){
                return left
            } else {
                return right
            }
        }
    }
}

// test
//var obj = { st: "", fn : function(a) { ; this.st = this.st + a  } }
//var Mobj = F.Maybe(obj)
//var Mnull = F.Maybe(null)
//
//Mobj.obind('fn',"321").bind(console.log)
//
//
//var Eobj = F.Either("empty",obj)
//Eobj.obind('fn',"234").bind(console.log)
//
//var Enull = F.Either("left",null)
//Enull.obind('fn',"234").bind(console.log)
//
//F.Maybe("xx").bind(function(a,b){ return F.Maybe(a+b)},"123").bind(console.log)