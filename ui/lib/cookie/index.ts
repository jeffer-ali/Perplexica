import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.AES_SECRET_KEY || 'XANSWER_666';

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  try {
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error(e)
    return ''
  }
};
