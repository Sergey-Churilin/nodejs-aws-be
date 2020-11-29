'use strict';

import { createProduct as addProductToDB } from '../services/product';

export const createProduct = async event => {
    await addProductToDB(JSON.parse(event.body));
};
