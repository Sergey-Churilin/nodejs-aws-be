import { getProductsList } from '../../../product-service/handlers/getProductsList';
import { productsList } from '../../../product-service/localDb/productsList';

describe('getProductsList', () => {
    it('Should return code 200 with correct data', async() => {
        const res = await getProductsList();
        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify(productsList),
        })
    });
});