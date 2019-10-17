

const { networks, generateMnemonic } = require('qtumjs-wallet');

const network = networks.testnet;

const sendFeeRate = 1000;

var createAccount = function(){
   return new Promise(async(resolve, reject) => {

   	const mnemonic = generateMnemonic();
   	const wallet = await network.fromMnemonic(mnemonic, '');
   	const privateKey=wallet.toWIF();
   	const address = wallet.address;
   	const account = {
   		privateKey: privateKey,
   		address: address
   	}
    resolve(account);
  })
}

var getBalance = function(privateKey){
   return new Promise(async(resolve, reject) => {
    const wallet = await network.fromWIF(privateKey);
    const info = await wallet.getInfo();
    resolve(info.balance);
  })
}

var validateSendInputs = function(address, amount, currency, fromAddress){
   return new Promise(async(resolve, reject) => {

    let result = {};

    const isValidAddress = await isAddress(address);

    if(isValidAddress)
    {
      if(address == fromAddress)
      {
        result.success = false;
        result.error = 'You cannot send fund to your own address'
        reject(result);
      }else{

        if(!isNumeric(amount))
        {
          result.success = false;
          result.error = 'Invalid amount';
          reject(result);
        }else{

          if(currency=='')
          {
            currency = 'qtum'
          }

          if(currency.toLowerCase() != 'qtum')
          {
            result.success = false;
            result.error = 'Only QTUM is allowed for sending';
            reject(result);
          }else{
            result.success = true;
            resolve(result);
          }

          
        }
      }
    }else{
      result.success = false;
      result.error = 'Invalid address';
      reject(result);
    }

    
  })
}

var sendToken = function(address, amount, _privateKey){
   return new Promise(async(resolve, reject) => {


   	const wallet = await network.fromWIF(_privateKey);

    var amt = parseFloat(amount) * 1e8;
    var fr = parseFloat(sendFeeRate);

    let result = {};
    let txId = '';

    try{

      const tx = await wallet.send(address, amt, {
        feeRate: fr,
      })
      if(tx)
      {
	    result.success = true;
	    result.error = '';
	    result.tx = tx.txid;
      }else{
      	result.success = false;
	    result.error = 'Transaction error';
	    result.tx = '';
      }
      resolve(result);
      

    }catch(e){
      result.tx ='';
	  result.success = false;
      result.error = 'Network error';
      reject(result);

    }

  })
}

var isAddress = function(address) {
  return address && address.length === 34;
}
var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


module.exports = {
    getBalance: getBalance,
    createAccount: createAccount,
    isAddress: isAddress,
    validateSendInputs: validateSendInputs,
    sendToken: sendToken
};