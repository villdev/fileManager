const { app } = require('./app');
const sqlite3 = require('sqlite3').verbose();
const request = require('supertest');
const db = new sqlite3.Database(':memory:');beforeAll(() => {
    process.env.NODE_ENV = 'test';
})

const db = new sqlite3.Database(':memory:');

beforeAll(() => {
    process.env.NODE_ENV = 'test';
})


const seedDb = db => {
    db.run('CREATE TABLE IF NOT EXISTS persons (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');
    db.run('DELETE FROM persons');
    const stmt = db.prepare('INSERT INTO persons (name, age) VALUES (?, ?)');
    stmt.run('Jane', 1);
    stmt.finalize();
}

test('get persons', () => {
    db.serialize(async () => {
        seedDb(db);
        const res = await request(app).get('/');
        const response = [
            { name: 'Jane', id: 1, age: 1 }
        ]
        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    })
});

const response = [
    { name: 'Jane', id: 1, age: 1 }
];

expect(res.status).toBe(200);
expect(res.body).toEqual(response);



test('add person', () => {
    db.serialize(async () => {
        seedDb(db);
        await request(app)
            .post('/')
            .send({ name: 'Joe', age: 2 });        const res = await request(app).get('/');
        const response = [
            { name: 'Jane', id: 1, age: 1 },
            { name: 'Joe', id: 2, age: 2 }
        ]
        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    })
});

seedDb(db);

await request(app)
  .post('/')
  .send({ name: 'Joe', age: 2 });

  const res = await request(app).get('/');
  const response = [
    { name: 'Jane', id: 1, age: 1 },
    { name: 'Joe', id: 2, age: 2 }
  ]
  expect(res.status).toBe(200);
  expect(res.body).toEqual(response);

  test('update person', () => {
    db.serialize(async () => {
        seedDb(db);
        await request(app)
            .put('/1')
            .send({ name: 'Joe', age: 2 });        const res = await request(app).get('/');
        const response = [
            { name: 'Jane', id: 1, age: 1 }
        ]
        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    })
});

test('delete person', () => {
    db.serialize(async () => {
        seedDb(db);
        const res = await request(app).delete('/1');
        const response = [];
        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    })
});

describe('auth', () => {
    it('should resolve with true and valid userId for hardcoded token', async () => {
      const response = await user.auth('fakeToken')
      expect(response).toEqual({userId: 'fakeUserId'})
    })
  
    it('should resolve with false for invalid token', async () => {
      const response = await user.auth('invalidToken')
      expect(response).toEqual({error: {type: 'unauthorized', message: 'Authentication Failed'}})
    })
  })

  describe('GET /hello', () => {
    it('should return 200 & valid response if request param list is empity', async done => {
      request(server)
        .get(`/api/v1/hello`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toMatchObject({'message': 'Hello, stranger!'})
          done()
        })
    })
  
    it('should return 200 & valid response if name param is set', async done => {
      request(server)
        .get(`/api/v1/hello?name=Test%20Name`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toMatchObject({'message': 'Hello, Test Name!'})
          done()
        })
    })
    
    it('should return 400 & valid error response if name param is empty', async done => {
      request(server)
        .get(`/api/v1/hello?name=`)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toMatchObject({'error': {
            type: 'request_validation', 
            message: expect.stringMatching(/Empty.*\'name\'/), 
            errors: expect.anything()
          }})
          done()
        })
    })
  })

  describe('GET /goodbye', () => {
    it('should return 200 & valid response to authorization with fakeToken request', async done => {
      request(server)
        .get(`/api/v1/goodbye`)
        .set('Authorization', 'Bearer fakeToken')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body).toMatchObject({'message': 'Goodbye, fakeUserId!'})
          done()
        })
    })
  
    it('should return 401 & valid eror response to invalid authorization token', async done => {
      request(server)
        .get(`/api/v1/goodbye`)
        .set('Authorization', 'Bearer invalidFakeToken')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body).toMatchObject({error: {type: 'unauthorized', message: 'Authentication Failed'}})
          done()
        })
    })
  
    it('should return 401 & valid eror response if authorization header field is missed', async done => {
      request(server)
        .get(`/api/v1/goodbye`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body).toMatchObject({'error': {
            type: 'request_validation', 
            message: 'Authorization header required', 
            errors: expect.anything()
          }})
          done()
        })
    })
  })