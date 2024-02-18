import { expect, test } from '@playwright/test'


test('delete artice', async ({ request }) => {

    //Clean up by API (Delete Article)
    const deleteResponse = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${process.env['SLUGID']}`);
    expect(deleteResponse.status()).toEqual(204);
});