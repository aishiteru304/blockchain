const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const Web3 = require('web3')
const ganache = require('ganache-cli')

const app = express()
const port = 8080

app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
  res.json('Hello')
  // const web3 = new Web3('http://localhost:7545')

  // const provider = ganache.provider();
  // const web3 = new Web3(provider);


  // web3.eth.getAccounts()
  //     .then(accounts => {
  //         console.log(accounts)
  //         res.json({ count: accounts.length })
  //     })
  //     .catch((err) => {
  //         console.error(err);
  //         res.status(500).json({ message: 'Kiểm tra lại kết nối' })
  //     })
})


app.post('/login', (req, res) => {
  const token = jwt.sign(req.body, '1912');
  res.json({ token });
})

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, '1912', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Route bảo vệ yêu cầu cần xác thực JWT
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})


