const Web3  = require("web3");
const web31 = new Web3('http://127.0.0.1:30303');
const web32 = new Web3('http://127.0.0.1:30304');
const web33 = new Web3('http://127.0.0.1:30305');

 web31.eth.getCoinbase()
     .then(accounts => {
       web31.eth.personal.unlockAccount(accounts, '123456', 100).then(() => {
        console.log('true');
       });
     });
web32.eth.getCoinbase()
    .then(accounts => {
      web32.eth.personal.unlockAccount(accounts, '123456', 100).then(() => {
        console.log('true');
       });
    });
 web33.eth.getCoinbase()
     .then(accounts => {
       web33.eth.personal.unlockAccount(accounts, '123456', 100).then(() => {
        console.log('true');
       });
     });