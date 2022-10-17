import { Order } from 'sequelize';

export interface QueryResult {
    where: {
        [key: string]: {
            [key: string]: any;
        };
    };
    order?: Order;
    offset?: number;
    limit?: number;
}
