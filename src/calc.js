// check format, sort, repeat in one regex
const regexComplex = /^(\[0?1?2?3?4?5?6?7?8?9?\]){1,5}$/
const regexRemove = /[\[\]]/g
const regexSingle = /^([bsoe]{1}|\d{1,5})$/
// split complex bet
function getComplexBet(strBet){
  if(!strBet||strBet.length>255||!regexComplex.test(strBet))
    return null
  // remove '[' & ']'
  var str = strBet.replace(/\]\[/g,"|")
  str = str.replace(regexRemove,'')
  
  return str.split('|')
}
// check and return bet count of single bet
function getComplexBetCount(strBets){
  if(!strBets||strBets.length<1||strBets.length>5)
    return 0;
  var count = 1;
  for(var idx=0;idx<strBets.length;idx++){
    count *= strBets[idx].length;
  }
  return count;
}
// check and return bet count of single bet
function getSingleBetCount(strBet){
  return regexSingle.test(strBet) ? 1 : 0
}
function getBetCount(strBet){
  if(!strBet||strBet=="")
    return 0;
  // split bet by ','
  var bets = strBet.split(',')
  if(bets.length<1)
    return 0;
  var count = 0;
  var n;
  for(var bet of bets){
    if(bet[0]=='[')
      n =  getComplexBetCount(getComplexBet(bet))
    else
      n = getSingleBetCount(bet)
    if(n == 0)
      return 0;
    count+=n;
  }
  return count;
}
function test(){
  //var str = "[89],[0125],[089]"
  var str = "[89][0125][089]"
  console.log(getBetCount(str))
}
export var GetBetCount = getBetCount



// WEBPACK FOOTER //
// ./src/calc.js