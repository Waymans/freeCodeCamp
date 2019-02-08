//Returns certain status depending on cash in register
function checkCashRegister(price, cash, cid) {
  var change = [["PENNY", .01], ["NICKEL", .05], ["DIME", .1], ["QUARTER", .25], ["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]],
      diff = cash-price, 
	  diff2 = cash-price, 
	  cid2 = [].concat(cid), 
	  newCid = [],
      newCid2 = [],
      arr = [],
      arr1 = [],
      newArr = [];
  let i;
  for (i=cid.length-1; i>=0; i--) {
    newCid.push(cid[i][1]);
    newCid2.push(cid[i][1]);
  }
  newCid.reverse();
  newCid2.reverse();
  for (i=cid.length-1; i>=0; i--) {
    while (diff >= change[i][1] && newCid[i] > 0) {
      diff -= change[i][1]
      diff = diff.toFixed(2)
      newCid.splice(i,1,(newCid[i]-change[i][1]))
      if (!arr.includes(change[i])) {
        arr.push(change[i]);
      }
    } 
  }
  for (i=0; i<newCid.length; i++) {
    if (newCid[i] < 0.01) {
      newCid[i] = newCid[i];
    }
  }
  for (i=newCid.length; i>=0; i--) {
    if (newCid2[i]-newCid[i] > 0) {
      arr1.push((newCid2[i]-newCid[i]))
    }
  } 
  for (i=0; i<arr.length; i++) {
      arr1[i] = Number(arr1[i]).toPrecision(3)
  }
  for (i=0; i<arr.length; i++) {
    arr[i].splice(1,1,Number(arr1[i]));
  }
  if (diff2 > arr1.reduce((x,y)=>{return x+y})) {
    return {status: "INSUFFICIENT_FUNDS", change: []};
  } else if (diff2 === newCid2.reduce((x,y)=>{return x+y})) {
    return {status: "CLOSED", change: cid};
  } else {
    return {status: "OPEN", change: arr};
  } 
}
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));