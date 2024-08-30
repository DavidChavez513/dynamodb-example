import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    BatchWriteCommand,
    DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
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

    const dynamodb = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dynamodb);

    try {
        const {
            id,
            name,
            lastName
        } = event.body as User;
        
        const document = event.body as User
        
        console.info(`User info: ID => ${id} \n Name => ${name} \n Last name => ${lastName}`)
        
        const command = new BatchWriteCommand({
            RequestItems: {
                // An existing table is required. A composite key of 'title' and 'year' is recommended
                // to account for duplicate titles.
                [`BatchWrite${process.env.SAMPLE_TABLE}`]: [
                    document
                ],
            },
        });
        
        await docClient.send(command);

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

