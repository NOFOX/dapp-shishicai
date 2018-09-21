import EosApi from 'eosjs'
export const EOSNETWORK = {
  protocol:'https', // Defaults to https
  blockchain:'eos',
  host:'eosjs.eosshishicai.com', // ( or null if endorsed chainId )
  port:443, // ( or null if defaulting to 80 )
  chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
}
export var eos = EosApi({httpEndpoint: EOSNETWORK.protocol+"://"+EOSNETWORK.host+":"+EOSNETWORK.port,chainId:EOSNETWORK.chainId})



// WEBPACK FOOTER //
// ./src/eos.js