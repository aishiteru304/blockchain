import React, { useState, useRef, useEffect } from 'react'
import Web3 from 'web3'
import { loadContract } from '../ConnectContract'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
          setContractAddress(res.networks[5777].address)
        })
    }

  }, [])

  useEffect(() => {
    if (abi.length) {
      const web3 = new Web3('http://localhost:7545')
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


      contractRef.current.methods.setAccountInfo(nameRef.current.value, sex, birthday, phoneRef.current.value, emailRef.current.value).send({ from: loggedRef.current.account, gas: 300000 })
        .then(() => {
          window.location.href = "/"
          localStorage.removeItem('register')
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
