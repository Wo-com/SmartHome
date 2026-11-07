const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/////////////
// const CryptoJS = require('crypto-js/crypto-js');  //引用AES源码js

// const key = CryptoJS.enc.Utf8.parse("12345678911234561234567890123456");  //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('00000000000000001111111111111111');   //十六位十六进制数作为密钥偏移量

var fun_aes = require('aes.js')
var key = fun_aes.CryptoJS.enc.Utf8.parse("thisisjejsey12311");
var iv = fun_aes.CryptoJS.enc.Utf8.parse('thseismyinitvekkaeect');


// AES加密
function AES_Encrypt(word) {
  var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
  var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
  var hexStr = encrypted.ciphertext.toString().toUpperCase();

  console.log('hexStr->' + hexStr);
  var oldHexStr = fun_aes.CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  var base64Str = fun_aes.CryptoJS.enc.Base64.stringify(oldHexStr);
  //这里根据需求返回 base64Str 或 hexStr(解密时有小小差别)
  return base64Str;
}

// AES解密
// function AES_Decrypt(word) {
//   var hexStr = fun_aes.CryptoJS.enc.Hex.parse(word);//转hex
//   var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
//   var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
//   var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
//   var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
//   return decryptedStr.toString();
// }

// AES解密
function AES_Decrypt(word) {

  //如果加密返回的base64Str
  var srcs = word;
  //若上面加密返回的hexStr,需打开下面两行注释，再次处理
  //var encryptedHexStr = fun_aes.CryptoJS.enc.Hex.parse(word);
  // var srcs = fun_aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = fun_aes.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
  var value = decryptedStr.toString();
  // console.log('value->' + value);
  return value;
}

/////////////



module.exports = {
  formatTime: formatTime,//格式化时间

  Encrypt: AES_Encrypt,// AES加密
  Decrypt: AES_Decrypt,// AES解密
}
