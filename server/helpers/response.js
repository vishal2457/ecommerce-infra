const { encryptData } = require("./commonHelper");
const date = new Date();
const currentTime = date.toLocaleTimeString("en-US");
const stringifyMethod = (method) => {return JSON.stringify(method)}


//200 OK 
const successResponse = async (res,req, data, msg) => {
  req.logger.info(
    `[${req.route.path}, ${ stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`
  );
    res.status(200).send({ status: 1, data, msg });
  };  

  
  //Send encrypted response (needs to be decrypted on the client side)
  const sendEncryptedResponse = async(res, req,  data, msg) => {
    req.logger.info(
      `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`
    );
    let encryptedData = await encryptData(data)
    res.status(200).send({status: 1, data: encryptedData, msg});
  }

  //500 SERVER ERROR
  const serverError = (res, req,  err) => {
    req.logger.error( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${err}`);
    console.log(err, req.route.path, stringifyMethod(req.route.methods),"server err");
    res.status(500).send({ status: 0, msg: 'Server error' });
  };
  
  //404 Not Found
  const notFound = (res,req, msg) => {
    req.logger.warn( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`);
    res.status(404).send({ status: 0, msg });
  };
  
  //401 Unauthorized
    const unauthorized = (res, req, msg) => {
      req.logger.warn( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`);
    res.status(401).send({ status: 0, msg });
  };
  
  //400 Bad Request
  const other = (res, req, msg) => {
    req.logger.warn( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`);
    console.log(msg);
    res.status(400).send({ status: 0, msg });
  };

  //409 conflict (Used for duplicate values mainly)
  const alreadyExist = (res, req, msg) => {
    req.logger.warn( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], ${msg}`);
    res.status(409).send({ status: 0, msg });
  };


  //requires fields
  const requiredFieldsEmpty = (res, req, arr) => {
    req.logger.warn( `[${req.route.path}, ${stringifyMethod(req.route.methods)}][${currentTime}], "Required fields empty"`);
    res.status(422).send({status: 0, msg: arr[0].msg})
  }

 
  module.exports = {
    successResponse,
    serverError,
    notFound,
    unauthorized,
    other,
    alreadyExist,
    sendEncryptedResponse,
    requiredFieldsEmpty
  };
