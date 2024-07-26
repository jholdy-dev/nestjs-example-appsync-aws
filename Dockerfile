FROM --platform=linux/amd64 amazon/aws-lambda-nodejs

COPY . .
RUN npm install
RUN npm run build

CMD ["dist/src/lambda.handler"]
