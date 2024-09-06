import * as aws from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';

interface User {
	id: number;
	name: string;
	lastName: string;
	age?: number;
	address?: string;
	create_at: string;
	update_at: string;
}

export const handler = async (event: APIGatewayEvent) => {
	try {
		// Parsear el cuerpo del evento
		const body = JSON.parse(event.body || '{}') as User;
		const { id } = body;

		// Inicializar DynamoDB DocumentClient
		const dynamodb = new aws.DynamoDB.DocumentClient();
		const tableName = process.env.SAMPLE_TABLE || '';

		// Definir los parámetros para la consulta
		const params = {
			RequestItems: {
				[tableName]: {
					Keys: [
						{
							id: id
						},
					]
				}
			}
		};

		// Realizar la consulta a DynamoDB
		const result = await dynamodb.batchGet(params).promise();

		// Acceder a los resultados
		const users = result.Responses?.[tableName];
		if (users && users.length > 0) {
			const user = users[0];
			console.info(`User info: ID => ${user.id} \n Name => ${user.name} \n Last name => ${user.lastName}`);

			// Retornar la información del usuario
			return {
				statusCode: 200,
				body: JSON.stringify(user)
			};
		} else {
			return {
				statusCode: 404,
				body: JSON.stringify({ message: 'User not found' })
			};
		}

	} catch (error) {
		// Manejo de errores
		console.error('Error fetching user from DynamoDB:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Error fetching user from DynamoDB' })
		};
	}
};
