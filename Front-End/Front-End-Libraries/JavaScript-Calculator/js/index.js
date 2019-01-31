$(document).ready(function() {
  var output = $('#display');
  var input = $('button');
  var res = output.html(); // .innerHTML

  input.on( "click", handleClicks);
    
  res = '0';
  var deci = true;

  function handleClicks(e) { 
    var regex = /[\+\*-\/]/;
    switch(e.target.innerHTML){
      case '=':
        res = parseFloat(eval(res));
        output.text(res);
        deci = true;
        break;
      case 'AC':
        res = '0';
        output.text(res);
        deci = true;
        break;
      case '+/-':
        if (res === '0') {
          break;
        } else {
          res = eval(-eval(res));
          output.text(res);
          break;
        }
      case '%':
        if (res === '0') {
          break;
        } else {
          res = eval(.01 * eval(res));
          output.text(res);
          break;
        }
      case '.': 
        if (/\./.test(res[res.length-1]) && /\./.test(e.target.innerHTML)) {
          res[res.length-1] = e.target.innerHTML;
          output.text(res);
          break;
        } else {
          if (deci) {
            res = res.concat('.');
            output.text(res);
            deci = false;
            break;
          } else {
            break;
          }
        }
      default: 
        if (res[0] === '0') {
          if (!regex.test(e.target.innerHTML) && res[1] !== '.') {
            res = e.target.innerHTML;
            output.text(res);
          } else {
            res += e.target.innerHTML;
            output.text(res);
          }
        } else if (regex.test(res[res.length-1]) && regex.test(e.target.innerHTML)) {
            res = res.replace(res[res.length-1] ,e.target.innerHTML);
            output.text(res);
        } else if (regex.test(res[res.length-1])) {
            if (e.target.innerHTML !== 0) {
              res += e.target.innerHTML;
              output.text(res);
            }
        } else {
            if (regex.test(e.target.innerHTML)) {
              res += e.target.innerHTML;
              output.text(res);
              deci = true;
            } else {
              if (e.target.innerHTML === '0' && res[res.length-1] === '0') {
                break;
              } else {
                res += e.target.innerHTML;
                output.text(res);
              }
            }
        }
    }
  }
});