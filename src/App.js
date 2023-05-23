import './App.css'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Information from './components/Information'
import Update from './components/Update'
import Web3 from 'web3';
import { loadContract } from './components/ConnectContract';
import axios from 'axios';

function App() {

  //Lưu trạng thái đăng kí
  const storageRegister = JSON.parse(localStorage.getItem('register'))
  const [isRegister, setIsRegister] = useState(storageRegister ?? false)

  //Lưu tên đăng nhập và trạng thái đăng nhập
  const storageLogin = JSON.parse(localStorage.getItem('login'))
  const loggedRef = useRef(storageLogin ?? {})

  // Lưu list account kết nối với ganache
  const [accounts, setAccounts] = useState([])

  // Lưu account hiện tại đang đăng nhập
  const [currentAccount, setCurrentAccount] = useState()

  // Lưu trạng thái đăng xuất
  const [isLogout, setIsLogout] = useState(false)


  //Hàm kết nối với ganache
  useEffect(() => {
    const web3 = new Web3('http://127.0.0.1:30303')

    web3.eth.personal.getAccounts()
      .then(accounts => {
        setAccounts(accounts)
      })
      .catch(() => alert('Kiểm tra lại kết nối'))
  }, [])


  //Hàm xử lí đăng nhập
  const handleLogin = () => {

    if (window.ethereum) {

      window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {},
        }],
      })
    }
    else {
      alert('Bạn chưa tải metamask')
    }
  }

  //Lắng nghe sự thay đổi account trên metamask
  window.ethereum.on('accountsChanged', function (newAccount) {
    //Nếu tồn tại account mới
    if (newAccount[0]) {
      setCurrentAccount(newAccount[0])
    }
    else {
      //Nếu không tồn tại account mới => đăng xuất
      setIsLogout(true)
    }
    setIsRegister(false)
    localStorage.removeItem('register')
  })

  //Hàm đăng xuất
  useEffect(() => {
    if (isLogout) {
      localStorage.removeItem('login')
      window.location.href = '/'
    }
  }, [isLogout])

  //Hàm đăng nhập
  useEffect(() => {
    if (currentAccount) {
      const findAccount = accounts.find((account) => account.toLowerCase() === currentAccount)
      if (findAccount) {

        // Yêu cầu server gửi token
        axios.post('http://localhost:8080/login', { username: findAccount })
          .then((res) => {
            localStorage.setItem('token', res.data.token)
          })


        loadContract('Faucet')
          .then(res => {
            const web3 = new Web3('http://127.0.0.1:30303')
            const contractFaucet = new web3.eth.Contract(res.abi, res.networks[1337].address)


            contractFaucet.methods.getAccountInfo().call({ from: findAccount })
              .then(res => {

                //Nếu account chưa có cập nhật thông tin
                if (res[0] === "") {
                  localStorage.setItem('login', JSON.stringify({ account: findAccount, state: true }))
                  localStorage.setItem('register', JSON.stringify(true))
                  setIsRegister(true)
                }


                //Đã cập nhật thông tin
                else if (res[0]) {
                  localStorage.setItem('login', JSON.stringify({ account: findAccount, state: true }))
                  window.location.href = '/'
                }
                else {
                  alert("Đăng nhập không thành công")
                  window.location.href = '/'
                }
              })
          })

      }
      else {
        alert("Có địa chỉ không hợp lệ, hãy kết nối lại")
        localStorage.removeItem('login')

        window.location.href = '/'

      }
    }
  }, [currentAccount, accounts])


  const handleChange = () => {
    window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {},
      }],
    });
  }




  return (
    <div className='wrapApp'>
      <div className='wrapHeader'>
        <div className='container d-flex headerHeight'>
          <div className='col-3'>
            LOGO
          </div>
          <div className='d-flex justify-content-between col-9'>
            <div>
              <Link to='/' className='me-5' >Trang chủ</Link>
              <Link to='/information' className='me-5'>Thông tin</Link>
              <Link to='/update' >Cập nhật</Link>
            </div>
            <div className='d-flex'>
              {/* {!loggedRef.current.state && <p className='cursorPointer'>Đăng kí</p>} */}
              {loggedRef.current.state && <p className='cursorPointer'>{loggedRef.current.account}</p>}
              {!loggedRef.current.state && <p className='ms-5 cursorPointer' onClick={handleLogin}>Đăng nhập</p>}
              {loggedRef.current.state && <p className='ms-5 cursorPointer' onClick={handleChange}>Thay đổi</p>}
            </div>
          </div>
        </div>
      </div>

      {isRegister &&
        <div className='register'>
          <div className='registerContent'>

            <Update props="Đăng kí" />

          </div>
        </div>
      }

      <Routes>

        <Route exact path='/information' element={<Information />} />
        <Route exact path='/update' element={<Update props="Cập nhật" />} />
        <Route exact path='/' element={<div></div>} />
      </Routes>
    </div>
  );
}


export default App;
