import * as aws from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';

interface User {
	id: string;
	name: string;
	lastName: string;
	age?: string;
	address?: string;
	create_at: string;
	update_at: string;
}

export const handler = async (event: APIGatewayEvent) => {
	try {

		const { id } = event.body as User;

		const dynamodb = new aws.DynamoDB.DocumentClient();

		const tableName = process.env.SAMPLE_TABLE || '';

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
		}

		const user = await dynamodb.batchGet(params).promise();

		user.Responses?.tableName.forEach((element) => {
			console.info(`User info: ID => ${element.id} \n Name => ${element.name} \n Last name => ${element.lastName}`)

			return {
				statusCode: 200,
				body: element
			}
		});

		return {
			statusCode: 200,
			body: user
		}
	} catch (error) {
		throw Error('Hubo un error al guardar o leer los datos en DynamoDB')
	}
};