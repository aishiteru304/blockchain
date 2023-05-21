const KeyStorage1 = require("../public/contracts/Node1KeyStorage.json")
const KeyStorage2 = require("../public/contracts/Node2KeyStorage.json")
const KeyStorage3 = require("../public/contracts/Node3KeyStorage.json")
const Web3  = require("web3");
const { split, combine } = require("shamir-secret-sharing");
//Địa chỉ của từng người dùng

const addressct1 = "0xcFc9335C8910Ad8aC5dfdFf82273D6a156775b56";
const addressct2 = "0x31A0B0756F181235B50Cc8631461844079a97fF8";
const addressct3 = "0xd10Ac697499c2a574f55e84b2dCa84FD4E687cF4";

const name = "Phan Khac Uy";
const sex = "Nam";
const dateOfBirth = "21/01/2001";
const email = "phankhacuy@gmail.com";
const phoneNumber = "0376393519";


const web31 = new Web3('http://127.0.0.1:30303');
const web32 = new Web3('http://127.0.0.1:30304');
const web33 = new Web3('http://127.0.0.1:30305');

// node 1
const personalKeyStorage1 = new web31.eth.Contract(KeyStorage1.abi, KeyStorage1.networks[1337].address);
const personalKeyStorage2 = new web32.eth.Contract(KeyStorage2.abi, KeyStorage2.networks[1337].address);
// tạo nguoi mới
//   personalKeyStorage1.methods.storeKeyPart(addressct1,'1234').send({from: addressct1,gas: 2000000,
//        gasPrice: web31.utils.toWei("10", "gwei")})

//truy xuất
    personalKeyStorage1.methods.getKeyParts(addressct1).call({from: addressct1}).then(function(data1){

       personalKeyStorage2.methods.getKeyParts(addressct2).call({from: addressct2}).then(function(data2){
        
        const uint8ArrayFromHex1 = new Uint8Array(data1.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const uint8ArrayFromHex2 = new Uint8Array(data2.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        selectedShares = [uint8ArrayFromHex1, uint8ArrayFromHex2];

        combine(selectedShares)
                 .then((recoveredBytes) => {
                     const recoveredSecret = new TextDecoder().decode(recoveredBytes);
                     //console.log(recoveredSecret);
                     // Thử mã sau khôi phục lại
                      const privateKey = forge.pki.privateKeyFromPem(recoveredSecret);
                     // Kí
                     plainText ="phankhacuy"

                    const md = forge.md.sha256.create();
                    md.update(plainText, 'utf8');
                    const signature = privateKey.sign(md);

                    const publicKey = forge.pki.publicKeyFromPem(publicKey_pem);
                     // Xác thực
                     const md2 = forge.md.sha256.create();
                    md2.update(plainText, 'utf8');
                    const verified = publicKey.verify(md2.digest().bytes(), signature);

                    console.log('Verified:', verified);
        })


        });
    });

// node 2

// tạo nguoi mới
//   personalKeyStorage2.methods.storeKeyPart(addressct2,'1234').send({from: addressct2,gas: 2000000,
//        gasPrice: web32.utils.toWei("10", "gwei")})

//truy xuất
  //  personalKeyStorage2.methods.getKeyParts(addressct2).call({from: addressct1}).then(function(data){
  //     console.log("key:", data) });

// node 3
const personalKeyStorage3 = new web33.eth.Contract(KeyStorage3.abi, KeyStorage3.networks[1337].address);
// tạo nguoi mới
//   personalKeyStorage3.methods.storeKeyPart(addressct3,'1234').send({from: addressct3 ,gas: 2000000,
//        gasPrice: web33.utils.toWei("10", "gwei")})

//truy xuất
    // personalKeyStorage3.methods.getKeyParts(addressct3).call({from: addressct3}).then(function(data){
    //    console.log("key:", data) });
