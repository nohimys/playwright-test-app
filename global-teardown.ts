import { expect, request } from "@playwright/test";

export default async () => {
    const context = await request.newContext();

    //Clean up by API (Delete Article)
    const deleteResponse = await context.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${process.env['SLUGID']}`,
        {
            headers: {
                'Authorization': `Token ${process.env.ACCESS_TOKEN}`
            }
        }
    );
    expect(deleteResponse.status()).toEqual(204);
}