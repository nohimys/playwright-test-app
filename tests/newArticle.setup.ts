import {expect, test} from '@playwright/test'


test('create new artice', async({page, request}) => {
   
    const title = "Marvel";

    //Create Article
    const responseArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": title,
                "description": "Science",
                "body": "Universe is beautiful"
            }
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    expect(responseArticle.status()).toEqual(201);

    const articleslug = (await responseArticle.json()).article.slug;

    process.env['SLUGID'] = articleslug;
});