import React, { useState, useRef, useEffect } from 'react'
import Web3 from 'web3'
import { loadContract } from '../ConnectContract'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import forge from 'node-forge';
import { split, combine } from 'shamir-secret-sharing';
import config from '../../config.json';


export default function Update({ props }) {

  const storageLogin = JSON.parse(localStorage.getItem('login'))
  const loggedRef = useRef(storageLogin ?? {})
  const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()

  // Lưu giới tính
  const [sex, setSex] = useState("Nam")

  // Lưu ngày sinh
  const [birthday, setBirthday] = useState('')

  const [contractAddress, setContractAddress] = useState('')
  const [abi, setAbi] = useState([])
  const contractRef = useRef()
  // const [info, setInfo] = useState({})

  useEffect(() => {
    if (loggedRef.current.state) {
      loadContract('Faucet')
        .then(res => {
          setAbi(res.abi)
          setContractAddress(res.networks[1337].address)
        })
    }

  }, [])

  useEffect(() => {
    if (abi.length) {
      const web3 = new Web3('http://127.0.0.1:30303')
      const contractFaucet = new web3.eth.Contract(abi, contractAddress)
      contractRef.current = contractFaucet

      // contractRef.current.methods.setAccountInfo("name1", 23).send({ from: loggedRef.current.account })
      //   .then(res => console.log(res))

      // contractRef.current.methods.getAccountInfo().call({ from: loggedRef.current.account })
      //   .then(res => setInfo(res))
    }
  }, [abi, contractAddress])

  const handleUpdate = () => {
    if (nameRef.current.value === '' || birthday === '' || phoneRef.current.value === '' || emailRef.current.value === '')
      alert("Không được để trống")
    else if (isNaN(phoneRef.current.value) || phoneRef.current.value[0] !== '0' || phoneRef.current.value.length !== 10)
      alert("Định dạng số điện thoại không hợp lệ")
    else if (!checkEmail(emailRef.current.value))
      alert("Định dạng email không hợp lệ")
    else {

      // Kết nối tới các node.
      const web31 = new Web3('http://127.0.0.1:30303');
      const web32 = new Web3('http://127.0.0.1:30304');
      const web33 = new Web3('http://127.0.0.1:30305');
      // Tạo cặp khóa RSA
        const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
      // Lấy khóa bí mật và khóa công khai
        const privateKey_pem = forge.pki.privateKeyToPem(keyPair.privateKey);
        const publicKey_pem = forge.pki.publicKeyToPem(keyPair.publicKey);
      //----------------------------------------------------------------
      // Chia Key thành 3 phần.
      const secretBytes = new TextEncoder().encode(privateKey_pem);
      split(secretBytes, 3, 2)
      .then(shares => {

        // chuyển phần shares thành hex string để lưu.
        //const hexString = Array.from(shares[1], byte => byte.toString(16).padStart(2, '0')).join('');
        // chuyển phần hex string về lại shares để tạo lại khóa
        //const uint8ArrayFromHex = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // Chuyển phần kiểu key thành string để lưu: const privateKey_pem = forge.pki.privateKeyToPem(keyPair.privateKey);
        // chuyển string về lại key để mã hóa: const publicKey = forge.pki.publicKeyFromPem(data[3]);

          // Lưu shares1 trên node 1.
          const sharesString1 = Array.from(shares[0], byte => byte.toString(16).padStart(2, '0')).join('');
          web31.eth.getCoinbase()
           .then(accounts => {
            // Mở khỏa tài khoản hệ thống trong node1.
            const passNode1 = config.node1
            web31.eth.personal.unlockAccount(accounts, passNode1, 100).then(() => {
            // Lưu vào contract trên node 1.
            loadContract('Node1KeyStorage')
            .then(res => {
            const personalKeyStorage = new web31.eth.Contract(res.abi, res.networks[1337].address);
            personalKeyStorage.methods.storeKeyPart(loggedRef.current.account,sharesString1).send({from: accounts })
             });
          })
          });

          // Lưu shares2 trên node 2.
          const sharesString2 = Array.from(shares[1], byte => byte.toString(16).padStart(2, '0')).join('');
          web32.eth.getCoinbase()
          .then(accounts => {
            // Mở khỏa tài khoản hệ thống trong node2.
            const passNode2 = config.node2
            web32.eth.personal.unlockAccount(accounts, passNode2, 100).then(() => {
            // Lưu vào contract trên node 1.
            loadContract('Node2KeyStorage')
            .then(res => {
            const personalKeyStorage = new web32.eth.Contract(res.abi, res.networks[1337].address);
            personalKeyStorage.methods.storeKeyPart(loggedRef.current.account,sharesString2).send({from: accounts })
             });
          })
          });

          // Lưu shares3 trên node 3.
          const sharesString3 = Array.from(shares[2], byte => byte.toString(16).padStart(2, '0')).join('');
          web33.eth.getCoinbase()
          .then(accounts => {
            // Mở khỏa tài khoản hệ thống trong node3.
            const passNode3 = config.node3
            web33.eth.personal.unlockAccount(accounts, passNode3, 100).then(() => {
            // Lưu vào contract trên node 3.
            loadContract('Node3KeyStorage')
            .then(res => {
            const personalKeyStorage = new web33.eth.Contract(res.abi, res.networks[1337].address);
            personalKeyStorage.methods.storeKeyPart(loggedRef.current.account,sharesString3).send({from: accounts})
             });
          })
          });

          const plainText = nameRef.current.value + "," + sex + "," + birthday + "," + phoneRef.current.value
          + "," + emailRef.current.value;
          // Kí
          const md = forge.md.sha256.create();
          md.update(plainText, 'utf8');
          const signature = keyPair.privateKey.sign(md);

          //Mở khóa tài khoản hiện tại.
            web31.eth.personal.unlockAccount(loggedRef.current.account, '123456', 100).then(() => {
              contractRef.current.methods.setAccountInfo(nameRef.current.value, sex, birthday, phoneRef.current.value, emailRef.current.value, signature, publicKey_pem).send({ from: loggedRef.current.account})
              .then(() => {
                window.location.href = "/"
                localStorage.removeItem('register')
              })

          });
    })


    }

  }

  const handleGenderChange = (e) => {
    if (e.target.value === 'male') setSex("Nam")
    else setSex("Nữ")
  }

  const handleChangeDay = (date) => {
    date = new Date(date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    setBirthday(`${day}/${month}/${year}`)
  }

  const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <div className='container mt-5'>
      {loggedRef.current.state &&
        <div>
          <div ><input placeholder='name' className='updateInput' ref={nameRef}></input></div>
          <div >
            <input placeholder='sex' className='updateInput' readOnly value={sex}></input>
            <select id="gender" name="gender" className='gender' onChange={handleGenderChange}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div className='d-flex'><input placeholder='dateOfBirth' className='updateInput dateUpdate' value={birthday} readOnly></input>
            <DatePicker
              onChange={handleChangeDay}
              dateFormat="dd/MM/yyyy"
              placeholderText="Tìm ngày sinh"
              className='selectDay'
            />
          </div>
          <div ><input placeholder='phoneNumber' className='updateInput' ref={phoneRef}></input></div>
          <div ><input placeholder='email' className='updateInput' ref={emailRef}></input></div>
          <button className='btn btn-success' onClick={handleUpdate}>{props}</button>
        </div>
      }
    </div>
  )
}
