import * as aws from 'aws-sdk';

interface User {
	id: number;
	name: string;
	lastName: string;
	age?: number;
	address?: string;
	create_at: string;
	update_at: string;
}

export const app = async (body: User) => {
	const dynamodb = new aws.DynamoDB.DocumentClient();

	const {
		id,
		name,
		lastName
	} = body;

	const document = body;

	const tableName = process.env.SAMPLE_TABLE || '';

	console.info(`User info:`, document);

	const params = {
		RequestItems: {
			[tableName]: [
				{
					PutRequest: {
						Item: document
					}
				}
			]
		}
	};

	try {
		const data = await dynamodb.batchWrite(params).promise();
		console.info('BatchWrite response:', data);
	} catch (err) {
		console.error('Error in BatchWrite:', err);
		throw new Error('Error writing to DynamoDB');
	}

	const userInfo = {
		id: id,
		name: name,
		lastName: lastName
	};

	return {
		statusCode: 200,
		body: JSON.stringify(userInfo)
	};
};
