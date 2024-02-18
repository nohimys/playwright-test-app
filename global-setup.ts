import { expect, request } from "@playwright/test";
import user from './.auth/user.json'
import fs from 'fs'

const USERNAME = 'pwtest@test.com';
const PASSWORD = 'Welcome1';

const authFile = '.auth/user.json'

export default async () => {
    const context = await request.newContext();

    //Get the Auth Token
    const tokenResponse = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            'user': {
                'email': USERNAME,
                'password': PASSWORD
            }
        }
    });
    const responseBody = await tokenResponse.json();
    const token = responseBody.user.token;

    process.env['ACCESS_TOKEN'] = token;
    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(authFile, JSON.stringify(user));

    const title = "Marvel2";

    //Create Article
    const responseArticle = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": title,
                "description": "Science",
                "body": "Universe is beautiful"
            }
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${process.env.ACCESS_TOKEN}`
        }
    });
    expect(responseArticle.status()).toEqual(201);

    const articleslug = (await responseArticle.json()).article.slug;

    process.env['SLUGID'] = articleslug;
}