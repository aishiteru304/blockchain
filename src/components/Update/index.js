import React, { useState, useRef, useEffect } from 'react'
import Web3 from 'web3'
import { loadContract } from '../ConnectContract'
export default function Update() {

  const storageLogin = JSON.parse(localStorage.getItem('login'))
  const loggedRef = useRef(storageLogin ?? {})
  const nameRef = useRef()
  const sexRef = useRef()
  const dateRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()

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
    if (nameRef.current.value === '')
      alert("Không được để trống")
    else {

      contractRef.current.methods.setAccountInfo(nameRef.current.value, sexRef.current.value, dateRef.current.value, phoneRef.current.value, emailRef.current.value).send({ from: loggedRef.current.account, gas: 300000 })
        .then(() => window.location.href = "/")

    }

  }

  return (
    <div className='container mt-5'>
      {loggedRef.current.state &&
        <div>
          <div ><input placeholder='name' className='updateInput' ref={nameRef}></input></div>
          <div ><input placeholder='sex' className='updateInput' ref={sexRef}></input></div>
          <div ><input placeholder='dateOfBirth' className='updateInput' ref={dateRef}></input></div>
          <div ><input placeholder='phoneNumber' className='updateInput' ref={phoneRef}></input></div>
          <div ><input placeholder='email' className='updateInput' ref={emailRef}></input></div>
          <button className='btn btn-success' onClick={handleUpdate}>Cập nhật</button>
        </div>
      }
    </div>
  )
}
