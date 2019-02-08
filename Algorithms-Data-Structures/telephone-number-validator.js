//checks if phone numbers in US are valid entries or not
function telephoneCheck(str) {
  let regex = /^(1|)( |)(\(\d{3}\)|\d{3})(-| |)( |)\d{3}(-| |)\d{4}$/;
  // regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/; also works using '?'
  return regex.test(str);
}
console.log(telephoneCheck("555-555-5555"));