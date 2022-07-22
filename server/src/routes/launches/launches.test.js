const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect, mongoDisconnect1 } = require('../../services/mongo');

describe ('Launches API', ()=>{ 
	
	beforeAll( async () => {
		await mongoConnect();
	});

	afterAll( async () => {
		await mongoDisconnect1();
	});
	
	
	
	describe('Test GET /launches', () => {
    test('It should respond with 200 success', async()=> {
        const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
        //expect(response.statusCode).toBe(200);
    });
})

describe('Test POST /launche', ()=>{
	
	const completeLaunchData = {
		mission: 'USS Entrprise',
		rocket: 'NCC 1701-C',
		target: 'Kepler-442 b',
		launchDate: "January 4, 2028",
	}

	const launchDataWithoutDate = {
		mission: 'USS Entrprise',
		rocket: 'NCC 1701-C',
		target: 'Kepler-442 b',
	}
	const launchDataWithInvalidDate = {
		mission: 'USS Entrprise',
		rocket: 'NCC 1701-C',
		target: 'Kepler-442 b',
		launchDate: "zoot",
	}
  
	test('It should respond with 201 created', async()=>{
  	const response = await request(app)
  		.post('/v1/launches')
      .send( completeLaunchData)
			.expect('Content-Type', /json/)
      .expect(201);
			
			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();
			console.log(requestDate);
			console.log(new Date( toString(response.body.launchData)).valueOf());
			
			expect(responseDate).toBe(requestDate);
			expect(response.body).toMatchObject(launchDataWithoutDate);

	});
    
    
    test('It should catch missing required properties', async ()=>{
			const response = await request(app)
				.post('/v1/launches')
      	.send( launchDataWithoutDate)
				.expect('Content-Type', /json/)
      	.expect(400);
			expect(response.body).toStrictEqual({
				error :  'Bad request! Missing some launch proprety',
			})

    });
    test('It Should catch invalid dates', async()=>{
			const response = await request(app)
				.post('/v1/launches')
      	.send( launchDataWithInvalidDate)
				.expect('Content-Type', /json/)
      	.expect(400);
			expect(response.body).toStrictEqual({
				error : 'Invalid launch Date'
			})
    });
})


})

