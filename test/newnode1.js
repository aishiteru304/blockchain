const Web3  = require("web3");
const web31 = new Web3('http://127.0.0.1:30303');

// Tạo tài khoản trên node Geth và lưu trữ khóa công khai
const account1 = web31.eth.personal.newAccount('123456');
