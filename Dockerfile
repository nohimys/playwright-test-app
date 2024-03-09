FROM mcr.microsoft.com/playwright:v1.42.0-jammy

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm i
RUN npx playwright install