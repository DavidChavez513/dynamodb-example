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

	const dynamodb = new aws.DynamoDB.DocumentClient();

	try {
		const {
			id,
			name,
			lastName
		} = event.body as User;

		const document = event.body as User

		const tableName = process.env.SAMPLE_TABLE || '';

		console.info(`User info: ID => ${id} \n Name => ${name} \n Last name => ${lastName}`)

		const params = {
			RequestItems: {
				[tableName]: [
					{
						PutRequest: {
							Item: [document]
						}
					}
				]
			}
		};

		await dynamodb.batchWrite(params, function(err, data) {
			if (err) console.error(err);
			else console.info(data);
		}).promise();

		const userInfo = {
			id: id,
			name: name,
			lastName: lastName
		};

		return {
			statusCode: 200,
			body: userInfo
		}

	} catch (error) {
		throw Error('Hubo un error al guardar o leer los datos en DynamoDB')
	}
};

