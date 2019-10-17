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
            

            // let user = await db.getUser(userId); // get user

            // if(!user) // if user is undefined, create the user
            // {
            //   const account = await qtum.createAccount();

            //   const encryptedPrivateKey = await core.aesEncrypt(account.privateKey);
            //   user = await db.saveUser(userId, encryptedPrivateKey, account.address);
            //   let balance = await qtum.getBalance(account.privateKey);
            //   let response = core.setResponse(`Your new *QTUM* address is \`${account.address}\` Balance is *${balance}*. You can transfer fund into this address. `);

            //   res.status(200).send(response);

            // }else
              

      
            // }

          }

          res.status(200).send({ msg: `hello msg` });


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
