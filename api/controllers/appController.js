'use strict';

const util = require('../../lib/util.js'); // utility library
const core = require('../../lib/core.js'); // core library
const qtum = require('../../lib/qtum.js'); // qtum library



const db = require('../../lib/db.js'); // mongodb library
const base64 = require('base-64');

const axios = require('axios');
const request = require('request');
const uuidv4 = require('uuid/v4');
const { Pool, Client } = require('pg');

const explorerTx = 'https://testnet.qtum.info/tx';
const explorerAddress = 'https://testnet.qtum.info/address';
const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=';

exports.hello_world = async function(req, res) {

  try{

    res.set({'Content-Type':'text/javascript'});
    res.status(200).send({ msg: `Hello Triplo` });

    }catch(err)
  {
    let response = core.setResponse(`Something is wrong`);
    res.status(200).send(response);
  }
};


exports.create_api_request = async function(req, res) {

  try{

    res.set({'Content-Type':'text/javascript'});

    //verify header apiKey
    let auth = req.get('Authorization');
    if(auth)
    {
      let token = auth.replace('Bearer ', '');
      let apiKey = Buffer.from(token, 'base64').toString('ascii');

        await core.validateApiKey(apiKey).then(async function(data){

        if(data){ // valid apiKey
          const body = req.body;

          await db.saveLog(JSON.stringify(body));

          const responseId = body.responseId;

          const intentAction = body.queryResult.action;

          const parameters = body.queryResult.parameters;

          

          // let test = base64.encode(JSON.stringify(parameters))

          let userId = await core.getRequestUser(body.originalDetectIntentRequest);

          if(userId)
          {
            let user = await db.getUser(userId); // get user

            if(!user) // if user is undefined, create the user
            {
              const account = await qtum.createAccount();

              const encryptedPrivateKey = await core.aesEncrypt(account.privateKey);
              user = await db.saveUser(userId, encryptedPrivateKey, account.address);
              let balance = await qtum.getBalance(account.privateKey);
              let response = core.setResponse(`Your new *QTUM* address is \`${account.address}\` Balance is *${balance}*. You can transfer fund into this address. `);

              res.status(200).send(response);

            }else{

              if(intentAction == 'sendfund')
              {
                const decryptedPrivateKey = await core.aesDecrypt(user.privateKey);

                let action = Array.isArray(parameters.action)?parameters.action[0].trim() : parameters.action.trim();
                let contact = Array.isArray(parameters.contact)?parameters.contact[0].trim() : parameters.contact.trim();
                let amount = Array.isArray(parameters.amount)?parameters.amount[0].trim() : parameters.amount.trim();
                let currency = Array.isArray(parameters.currency)?parameters.currency[0].trim() : parameters.currency.trim();
                if(isNaN(amount))
                {
                  let response = core.setResponse(`Amount is invalid or cannot be zero`);
                  res.status(200).send(response);

                }else{

                  if(amount<=0)
                  {
                    let response = core.setResponse(`Amount is invalid or cannot be zero`);
                    res.status(200).send(response);

                  }else{

                    await qtum.getBalance(decryptedPrivateKey).then(async function(data){

                        if(amount>data)
                        {
                          let response = core.setResponse(`You have insufficient fund`);
                          res.status(200).send(response);
                        }else{

                          const addressValid = await qtum.isAddress(contact);
                          if(!addressValid)
                          {
                            let matchUserPattern = false;
                            if ( (contact.indexOf("<@") == 0) && (contact.indexOf(">") == (contact.length-1)) ) {
                               contact = contact.substring(2, contact.length-1);

                               if(contact.length == 9) // slack userID length must be 9 characters
                               {
                                matchUserPattern = true;
                              }
                            }
                           
                            // check if userId is used in contact
                            let checkUser = await db.getUser(contact);
                            if(checkUser)
                            {
                              contact = checkUser.address;
                            }else{

                              // init other user if it is new and haven't done first fullfilment
                              if(matchUserPattern && contact!='USLACKBOT')
                              {
                                const newaccount = await qtum.createAccount();
                               
                                const newencryptedPrivateKey = await core.aesEncrypt(newaccount.privateKey);
                                const newUser = await db.saveUser(contact, newencryptedPrivateKey, newaccount.address.base58);

                                contact = newUser.address;
                              }
                            }
                          }

                          if(contact=='USLACKBOT')
                          {
                            let response = core.setResponse(`Can't send to slackbot`);
                            res.status(200).send(response);

                          }else{

                            // let response = core.setResponse(`contact: ${contact} amount: ${amount} currency: ${currency} address: ${user.address}`);
                            // res.status(200).send(response);

                            // validation
                            const validateResult = await qtum.validateSendInputs(contact,amount,currency,user.address).then(async function(data){

                            const decryptedPrivateKey = await core.aesDecrypt(user.privateKey);


                            await qtum.sendToken(contact, parseFloat(amount), decryptedPrivateKey).then(function(data){
                                let text = `Transfer is submitted, it may take up to 1 minute to confirm on the blockchain`;
                                let link = `${explorerTx}/${data.tx}`;

                                let attachments = core.setTXAttachment(text, link, `${data.tx}`);
                                let response = core.setResponse(text,attachments);
                                res.status(200).send(response);
                              }).catch(function(e){
                                let response = core.setResponse(`Can't send transaction: ${e.error}`);
                                res.status(200).send(response);
                              })

                            }).catch(function(e){
                              let response = core.setResponse(`\`${contact}\` ${e.error} `);
                              res.status(200).send(response);

                            });

                          }

                        }
                    });
                  }

                }

              }else if(intentAction == 'getaccount')
              {
                 const decryptedPrivateKey = await core.aesDecrypt(user.privateKey);
                 await qtum.getBalance(decryptedPrivateKey).then(function(data){

                    let text = `Your *QTUM* address is \`${user.address}\` Balance is *${data}*`;
                    let link = `${explorerAddress}/${user.address}`;
                    let attachments = core.setAddressAttachment(text, link, user.address);
                    let response = core.setResponse(text,attachments);
                    res.status(200).send(response);
                  }).catch(function(e){
                    let response = core.setResponse(`Something is wrong`);
                    res.status(200).send(response);
                  })

              }else if(intentAction == 'receivefund')
              {

                 let text = `Your *QTUM* address is \`${user.address}\``;
                 let imgUrl = `${qrCodeUrl}${user.address}`;

                 let attachments = core.setQrAttachment(`send fund to this address`, imgUrl);

                 let response = core.setResponse(text,attachments);
                 res.status(200).send(response);
              }
              else{
                let response = core.setResponse(`Sorry I don't get that`);
                res.status(200).send(response);
              }

              

      
            }

          }


        }else{
          res.status(200).send({ error: `Invalid apiKey` });
        }

      }).catch(function(err){
        let response = core.setResponse(`error: ${err}`);
        res.status(200).send(response);
      })

    }else{

      res.status(200).send({ error: `Invalid apiKey` });
    }

  }catch(err)
  {
    let response = core.setResponse(`Something is wrong`);
    res.status(200).send(response);
  }
};
