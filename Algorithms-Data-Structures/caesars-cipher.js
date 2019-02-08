//ROT13 cypher
function rot13(str) { 
  let first13 = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
  let second13 = ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  let extra = ['.',',','!','?',' '], arr = [];
  for (let i=0; i<str.length; i++) {
    if (extra.includes(str[i])) {
        arr.push(str[i])
    } else if (first13.includes(str[i])) {
        arr.push(second13[first13.indexOf(str[i])]);
    } else {
        arr.push(first13[second13.indexOf(str[i])]);
    }
  }
  return arr.join('')
}
console.log(rot13("GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT."));