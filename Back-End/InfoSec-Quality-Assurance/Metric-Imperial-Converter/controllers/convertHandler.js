/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  this.getNum = function(input) { 
    var regex = /^(\d+)?(\.\d+)?\/?(\d+)?(\.\d+)?[A-z]/; // can change
    if (regex.test(input)) { 
      var result = input.substring(0,input.search(/[A-z]/g));
      if (result.includes('/')) {
        result = result.split('/');
        return Number(result[0]) / Number(result[1]);
      } else if (result === '') {
        return 1;
      } else {
        return Number(result)
      }
    } else {
      return 'invalid number';
    }
  };
  
  this.getUnit = function(input) {
    var result;
    var array = ['gal','l','lbs','kg','mi','km'];
    if (array.includes(input.substring(input.search(/[A-z]/g)).toLowerCase())) {
      result = input.substring(input.search(/[A-z]/g)).toLowerCase();
    } else {
      result = 'invalid unit';
    }
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var array = ['gal','lbs','mi','l','kg','km'];
    var x = array.indexOf(initUnit) >= 3 ? -3 : 3
    return array[array.indexOf(initUnit) + x]
  };

  this.spellOutUnit = function(unit) { 
    var units = ['gal','lbs','mi','l','kg','km'];
    var array = ['gallons','pounds','miles','liters','kilograms','kilometers'];
    return array[units.indexOf(unit)]
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    switch(initUnit){
      case 'gal':
        return parseFloat((initNum * galToL).toFixed(5));
        break;
      case 'lbs':
        return parseFloat((initNum * lbsToKg).toFixed(5));
        break;
      case 'mi':
        return parseFloat((initNum * miToKm).toFixed(5));
        break;
      case 'l':
        return parseFloat((initNum / galToL).toFixed(5));
        break;
      case 'kg':
        return parseFloat((initNum / lbsToKg).toFixed(5));
        break;
      case 'km':
        return parseFloat((initNum / miToKm).toFixed(5));
        break;
      default:
        break;
    }
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit)
  };
  
}

module.exports = ConvertHandler;
