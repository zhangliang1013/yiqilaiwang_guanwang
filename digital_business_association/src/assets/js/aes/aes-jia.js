import fun_aes from './aes' //引用AES源码js

//十六位十六进制数作为秘钥

// var key = fun_aes.CryptoJS.enc.Utf8.parse("yiqilaiwang@1012");
var key = fun_aes.CryptoJS.enc.Utf8.parse("1fa6b935a611e9b9");
//十六位十六进制数作为秘钥偏移量
var iv = fun_aes.CryptoJS.enc.Utf8.parse(''); 
//加密
function EncryptBASE64 (word) {
  var srcs1 = fun_aes.CryptoJS.enc.Utf8.parse(word);
  var encrypted1 = fun_aes.CryptoJS.AES.encrypt(srcs1, key, { iv: iv, mode: fun_aes.CryptoJS.mode.ECB, padding: fun_aes.CryptoJS.pad.Pkcs7 });
  //返回base64加密结果
  return encrypted1.toString();
}
//暴露接口
export default EncryptBASE64