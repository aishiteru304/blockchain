import './App.css'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Information from './components/Information'
import Update from './components/Update'
import Web3 from 'web3';
import { loadContract } from './components/ConnectContract';
import CryptoJS from 'crypto-js';

function App() {

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
    const web3 = new Web3('http://localhost:7545')

    web3.eth.getAccounts()
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
        loadContract('Faucet')
          .then(res => {
            const web3 = new Web3('http://localhost:7545')
            const contractFaucet = new web3.eth.Contract(res.abi, res.networks[5777].address)


            contractFaucet.methods.getAccountInfo().call({ from: findAccount })
              .then(res => {
                //Nếu account chưa có cập nhật thông tin
                if (res[0] === "" && res[5] === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                  localStorage.setItem('login', JSON.stringify({ account: findAccount, state: true }))
                  window.location.href = '/'
                }
                //Đã cập nhật thông tin
                else if (res[5].split("0x")[1] === CryptoJS.SHA256(res[0] + res[1] + res[2] + res[3] + res[4]).toString()) {
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
              {!loggedRef.current.state && <p className='cursorPointer'>Đăng kí</p>}
              {loggedRef.current.state && <p className='cursorPointer'>{loggedRef.current.account}</p>}
              {!loggedRef.current.state && <p className='ms-5 cursorPointer' onClick={handleLogin}>Đăng nhập</p>}
              {loggedRef.current.state && <p className='ms-5 cursorPointer' onClick={handleChange}>Thay đổi</p>}
            </div>
          </div>
        </div>
      </div>

      <Routes>

        <Route exact path='/information' element={<Information />} />
        <Route exact path='/update' element={<Update />} />
        <Route exact path='/' element={<div></div>} />
      </Routes>
    </div>
  );
}


export default App;
