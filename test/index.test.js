var request = require('supertest');

describe('loading express', function () {
    var server;
    beforeEach(function () {
      server = require('./index');
    });
    afterEach(function () {
      server.close();
    });
    it('responds to /', (code)=> {
    request(server)
      .get('/')
      .expect(200, code);
    });
    it('404 everything else', function testPath(done) {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
    });

    it('getting array of courses', (code)=>{
        var courses_offered = {arr: 
            [{id: 21, name: 'HCI'},
            {id: 28, name:'sweng'}]
         };
        request(server)
        .get('/courses')
        .expect(200, code)
        .expect( {arr: 
            [{id: 21, name: 'HCI'},
            {id: 28, name:'sweng'}]
         });
    })
  });