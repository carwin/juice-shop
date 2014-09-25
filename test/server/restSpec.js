/*jslint node: true */

var frisby = require('frisby'),
    passwordHash = require('password-hash');

var URL = 'http://localhost:3000/rest';

/* User Login */
frisby.create('POST login non-existing user')
    .post(URL + '/user/login', {
        email: 'otto@mei.er',
        password: passwordHash.generate('ooootto')
    })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON('data', {})
    .toss();

frisby.create('POST new user')
    .post('http://localhost:3000/api/Users', {
        email: 'horst@horstma.nn',
        admin: false,
        password: passwordHash.generate('hooooorst')
    })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .afterJSON(function (user) {
        frisby.create('POST login existing user')
            .post(URL + '/user/login', {
                email: user.data.email,
                password: user.data.password
            })
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON('data', {
                id: user.data.id,
                email: user.data.email,
                password: user.data.password
            })
            .toss();
        frisby.create('DELETE existing user')
            .delete('http://localhost:3000/api/Users/' + user.data.id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json').toss();
    })
    .toss();




