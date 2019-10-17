'use strict';

const util = require('../../lib/util.js'); // utility library


const base64 = require('base-64');

const axios = require('axios');
const request = require('request');
const uuidv4 = require('uuid/v4');
const { Pool, Client } = require('pg');

exports.create_api_request = async function(req, res) {

  try{

    res.set({'Content-Type':'text/javascript'});

    res.status(200).send({ message: `hello api` });

  }catch(err)
  {
    res.status(400).send({ error: `error` });
  }
};
