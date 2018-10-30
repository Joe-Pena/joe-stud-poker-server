const chai = require('chai');
const chaihttp = require('chai-http');

const {app, startServer, stopServer} = require('../server');
const expect = chai.expect;

chai.use(chaihttp);

describe('Users', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return stopServer();
  })
})