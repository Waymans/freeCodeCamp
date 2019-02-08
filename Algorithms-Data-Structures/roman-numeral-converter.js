//converts a number to a Roman numeral
function convertToRoman(num) {
  let numerals = {1: 'I',5: 'V',10: 'X',50: 'L',100: 'C',500: 'D',1000: 'M'}, newNum = num.toString(), array = [], obj = Object.keys(numerals);
  for (let i=0; i<newNum.length; i++) {
    if (newNum[i] > 0) {
      array.push(newNum[i]*Math.pow(10,newNum.length-(i+1)));
    } 
  } 
  for (let i=0; i<array.length; i++) { 
    for (let j=obj.length-1; j>=0; j--) {    //using j++ brings about 4=1,1,1,1
      if (array[i] >= 1 && array[i] < 10) {
        func(1);
      } else if (array[i] >= 10 && array[i] < 100) {
        func(10);
      } else if (array[i] >= 100 && array[i] <1000) {
        func(100);
      } else {
        func(1000);
      }
      function func(a) {
        if (array[i] === Number(obj[j])) {
          array.splice(i,1,numerals[obj[j]]);
        } else if (array[i] === Number(obj[j])-a) {
          array.splice(i,1,numerals[a],numerals[obj[j]]);
        } else if (array[i] === Number(obj[j])+a) {
          array.splice(i,1,numerals[obj[j]],numerals[a]);
        } else if (array[i] === Number(obj[j])+2*a) {
          array.splice(i,1,numerals[obj[j]],numerals[a],numerals[a]);
        } else if (array[i] === Number(obj[j])+3*a) {
          array.splice(i,1,numerals[obj[j]],numerals[a],numerals[a],numerals[a]);
        } 
      }
    }
  }
  return array.join('')
} 
console.log(convertToRoman(5));