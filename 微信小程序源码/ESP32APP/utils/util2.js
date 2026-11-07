
//////////////////////////////

var fun_aes = require('aes.js')

// var base64_iv = 'AAAAAAAAAAAAAAAAAAAAAA==';
// var plain_iv = new ArrayBuffer(base64_iv, 'base64').toString('hex');
// var iv = fun_aes.CryptoJS.enc.Hex.parse(plain_iv);
var iv = fun_aes.CryptoJS.enc.Utf8.parse('oz5d2ja1shjee4km4');
var AESKey = '2B7E151628AED2A6ABF7158809CF4F3C';
var key = fun_aes.CryptoJS.enc.Utf8.parse('z3o7ndajejej49d5f8');
var message = "Looks like key but it's not me.";



// AES加密
function AES_Encrypt(word) {fun_aes.CryptoJS.AES.encrypt
  var ebytes = fun_aes.CryptoJS.AES.encrypt(word, key, { iv: iv });
  var ciphertext = ebytes.toString();
  console.log("ciphertext: ", ciphertext);

  return ciphertext;
}


// AES解密
function AES_Decrypt(word) {
  var decrypt = fun_aes.CryptoJS.AES.decrypt(word, key, { iv: iv });
  console.log("解密完成 开始编码");
  console.log(decrypt);
  var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
  var value = decryptedStr.toString();
  // var decryptedStr = decrypt.toString(fun_aes.CryptoJS.Base64);
  // var value = new ArrayBuffer(decryptedStr, 'base64').toString();

  console.log("Decrypted message: ", value);
  console.log(value);
  return value;
}

/////////////



module.exports = {


  Encrypt: AES_Encrypt,// AES加密
  Decrypt: AES_Decrypt,// AES解密
}
