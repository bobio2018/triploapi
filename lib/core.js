'use strict';

require('dotenv').config();
const axios = require('axios');
const passphrase = process.env.passphrase;
const endpointApiKey = process.env.endpointApiKey;
const AES = require('crypto-js/aes');
const CryptoJS = require('crypto-js');


var aesEncrypt = function(value){
   return new Promise((resolve, reject) => {
   	const encryptedValue = AES.encrypt(
      value,
      passphrase
    ).toString();

    resolve(encryptedValue);
  })
}

var aesDecrypt = function(value){
   return new Promise((resolve, reject) => {
   	const decryptedValue = AES.decrypt(
      value,
      passphrase
    ).toString(CryptoJS.enc.Utf8);

    resolve(decryptedValue);
  })
}

var validateApiKey = function(apiKey){
   return new Promise((resolve, reject) => {
    resolve(endpointApiKey == apiKey);
  })
}

var getRequestUser = function(data){
   return new Promise((resolve, reject) => {
   	let userId = "";
   	if(data.source)
   	{
   		if(data.source === 'slack')
   		{
          if(data.payload.data.event.user)
          {
            userId = data.payload.data.event.user;
          }
   		}
   	}

    resolve(userId);
  })
}

var setResponse = function(slackText, attachments){
   	let res = {};
   	res.fulfillmentText = slackText;
   	res.fulfillmentMessages = [];
   	res.source = "HashAI";
   	res.payload = {};
   	let slack = {};
   	slack.text = slackText;
    if(attachments)
    {
      slack.attachments = attachments;
    }
   	res.payload.slack = slack;
    
   	return JSON.stringify(res);
}

var setQrAttachment = function(_preText, _imgUrl){
    let attachments = [];
    let attachment1 = {};
    attachment1.color="#c53027";
    attachment1.footer="QR Code";
    attachment1.pretext = _preText;
    attachment1.image_url=_imgUrl;
    attachments.push(attachment1);
    return attachments;
}

var setTXAttachment = function(_preText, _linkUrl,_txId){
    let attachments = [];
    let attachment1 = {};
    attachment1.color="#c53027";
    attachment1.author_name="View transaction on QTUM explorer";
    attachment1.author_link=_linkUrl;
    attachment1.title=_txId;
    attachment1.title_link=_linkUrl;
    attachment1.thumb_url="https://qtum.org/user/themes/qtumv4/build/fonts/header-logo.svg";
    attachments.push(attachment1);
    return attachments;
}

var setAddressAttachment = function(_preText, _linkUrl,_address){
    let attachments = [];
    let attachment1 = {};
    attachment1.color="#c53027";
    attachment1.author_name="View address on QTUM explorer";
    attachment1.author_link=_linkUrl;
    attachment1.title=_address;
    attachment1.title_link=_linkUrl;
    attachment1.thumb_url="https://qtum.org/user/themes/qtumv4/build/fonts/header-logo.svg";
    attachments.push(attachment1);
    return attachments;
}


module.exports = {
    validateApiKey: validateApiKey,
    getRequestUser : getRequestUser,
    setResponse: setResponse,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    setQrAttachment: setQrAttachment,
    setTXAttachment: setTXAttachment,
    setAddressAttachment: setAddressAttachment
};