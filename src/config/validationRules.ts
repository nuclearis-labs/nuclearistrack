const rules = {
  userCreate: {
    'body.newUserName': 'required|unique:User,username|ascii|length:50,3',
    'body.newUserEmail': 'required|unique:User,email|email|length:100,3',
    'body.userType': 'required|integer|max:2'
  },
  userConfirm: {
    'body.passphrase':
      'required|ascii|length:50,4|same:body.confirm_passphrase',
    'params.id': 'required|ascii|length:50,3|savedRecord:User'
  },
  userRestore: {
    'body.mnemonic': 'required|isValidMnemonic',
    'body.newPassphrase':
      'required|ascii|length:50,8|same:body.confirm_passphrase'
  },
  userChange: {
    'body.passphrase': 'required|ascii|length:50,3',
    'body.email': 'required|email',
    'body.newPassphrase':
      'required|ascii|length:50,4|same:body.confirm_newPassphrase'
  },
  userVerifyAddress: {
    'params.address': 'required|checksumAddress'
  },
  userClose: {
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'params.address': 'required|checksumAddress'
  },
  transfer: {
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'body.to': 'required',
    'body.value': `required|integer`
  },
  projectCreate: {
    'body.expediente': 'required|integer',
    'body.proyectoTitle': 'required|ascii',
    'body.clientAddress': 'required|checksumAddress',
    'body.passphrase': 'required|ascii',
    'body.email': 'required|email',
    'body.oc': 'required|ascii'
  },
  projectClose: {
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'params.expediente': 'required|integer'
  },
  projectGetOne: {
    'query.expediente': 'required|integer'
  },
  projectAssignProcess: {
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'body.expediente': 'required|integer',
    'body.processContract': 'required|checksumAddress'
  },
  processCreate: {
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'body.processTitle': 'required|ascii',
    'body.supplierAddress': 'required|checksumAddress'
  },
  documentVerify: {
    'body.file': 'required|mime:pdf|size:5mb,1kb',
    'query.contract': 'required|checksumAddress'
  },
  documentUpload: {
    'body.contract': 'required|checksumAddress',
    'body.latitude': 'required|ascii',
    'body.longitude': 'required|ascii',
    'body.file': 'required|mime:pdf|size:5mb,1kb',
    'body.email': 'required|email',
    'body.passphrase': 'required|ascii',
    'body.comment': 'required|ascii|length:140,3'
  },
  documentGetOne: {
    'query.contract': 'required|checksumAddress',
    'query.hash': 'required|isSHA256'
  },
  auth: {
    'body.email': 'required|email|savedRecord:User,email',
    'body.passphrase': 'required|ascii'
  }
};

export default rules;
