
const Web3  = require("web3");

const web31 = new Web3('http://127.0.0.1:30303');
const web32 = new Web3('http://127.0.0.1:30304');
const web33 = new Web3('http://127.0.0.1:30305');
// //Lấy dánh sách tài khoản

web31.eth.personal.getAccounts()
 .then(accounts => {
   console.log('Danh sách tài khoản node 1:', accounts);
 })
 .catch(error => {
   console.error('Lỗi:', error);
 });

 web32.eth.personal.getAccounts()
 .then(accounts => {
   console.log('Danh sách tài khoản node 2:', accounts);
 })
 .catch(error => {
   console.error('Lỗi:', error);
 });
 web33.eth.personal.getAccounts()
 .then(accounts => {
   console.log('Danh sách tài khoản node 3:', accounts);
 })
 .catch(error => {
   console.error('Lỗi:', error);
 });
