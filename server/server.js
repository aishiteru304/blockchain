// const express = require('express')
// const jwt = require('jsonwebtoken')
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const Web3 = require('web3')
// const ganache = require('ganache-cli')

// const app = express()
// const port = 8080

// app.use(bodyParser.json())
// app.use(cors())


// app.get('/', (req, res) => {
//     res.json('Hello')
//     // const web3 = new Web3('http://localhost:7545')

//     // const provider = ganache.provider();
//     // const web3 = new Web3(provider);


//     // web3.eth.getAccounts()
//     //     .then(accounts => {
//     //         console.log(accounts)
//     //         res.json({ count: accounts.length })
//     //     })
//     //     .catch((err) => {
//     //         console.error(err);
//     //         res.status(500).json({ message: 'Kiểm tra lại kết nối' })
//     //     })
// })

// app.post('/sublogin', (req, res) => {
//     if (req.body.username === 'admin' && req.body.password === 'admin') {
//         const token = jwt.sign(req.body, '1912');
//         res.json({ token });
//     }
//     else res.status(500).json({ message: 'Tên tài khoản hoặc mật khẩu không đúng' })
// })

// app.post('/login', (req, res) => {
//     const token = jwt.sign(req.body, '1912');
//     res.json({ token });
// })

// // Middleware xác thực JWT
// function authenticateToken(req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (token == null) {
//         return res.sendStatus(401);
//     }

//     jwt.verify(token, '1912', (err, user) => {
//         if (err) {
//             return res.sendStatus(403);
//         }
//         req.user = user;
//         next();
//     });
// }

// // Route bảo vệ yêu cầu cần xác thực JWT
// app.get('/protected', authenticateToken, (req, res) => {
//     res.json({ user: req.user });
// });


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })


const express = require('express');
const session = require('express-session');
const { Issuer, Strategy } = require('openid-client');

const app = express();
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));

// Cấu hình thông tin OpenID Provider (OP)
const issuerURL = 'https://accounts.example.com'; // URL của OP
const clientID = 'your-client-id'; // ID Client
const clientSecret = 'your-client-secret'; // Client Secret
const redirectURI = 'http://localhost:3000/callback'; // URL callback của trang web1

(async () => {
  // Tải thông tin OpenID Provider (OP)
  const issuer = await Issuer.discover(issuerURL);
  const client = new issuer.Client({ client_id: clientID, client_secret: clientSecret, redirect_uris: [redirectURI] });

  // Đăng nhập - chuyển hướng đến trang xác thực
  app.get('/login', (req, res) => {
    const authURL = client.authorizationUrl({ scope: 'openid' });
    res.redirect(authURL);
  });

  // Xử lý callback sau khi người dùng xác thực thành công
  app.get('/callback', async (req, res) => {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(redirectURI, params, { state: req.session.state });
    // Lưu tokenSet hoặc thông tin cần thiết cho việc xác thực

    // Chuyển hướng người dùng đến trang web2
    res.redirect('http://localhost:4000');
  });

  // Khởi động server
  app.listen(3000, () => {
    console.log('Trang web1 đang chạy trên cổng 3000');
  });
})();
