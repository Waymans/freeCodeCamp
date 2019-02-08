//palindrome checker not including non-alphanumeric characters
function palindrome(str) {
  var regex = /[^a-z0-9]/g, newArr;
  str = str.toLowerCase(); 
  if (str.search(regex) !== -1) {
    while (str.search(regex) !== -1) {
      str = str.replace(regex, '');
    }
  }
  str = str.split('');
  newArr = [].concat(str).reverse();
  if (newArr.toString() === str.toString()) {
    return true;
  } else {
    return false;
  }
}
console.log(palindrome("A man,# a plan&, a canal. Panama"));