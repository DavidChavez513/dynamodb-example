
import { app } from './app';
import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent) => {
	try {

		const body = JSON.parse(event.body || '{}');
		console.info('Event: ', event.body);
		return app(body);

	} catch (error) {

		console.error('Error: ', error);

		throw Error('Hubo un error al guardar o leer los datos en DynamoDB')
	}
};

