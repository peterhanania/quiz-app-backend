<h1 align="center">
<img src="https://i.imgur.com/SFBMV7J.png" style="width:70px;height:80px" />

**Quiz App {Backend}**

</h1>

Made using [express](https://expressjs.com/), [mongoose](https://mongoosejs.com/), and [node.js](https://nodejs.org/).

## Getting Started

You can start setting up your server by filling the `.env` file with your own credentials.

- `MONGO_URL`= your mongo database url
- `MAIN_WEBSITE_URL`= your main website url, used for redirecting users to the main website after they log in. You can set that up later once you run your frontend. `default: http://localhost:3000`
- `SESSION_SECRET`= The secret key for your session (random characters)

Then, you can get started by installing the dependencies and running the following command:

```bash
npm install
# or
yarn install
```

then

```bash
npm run dev
# or
yarn dev
```

### What does this do?

The backend is responsible for handling all the logic for the quiz app:

- Creating the questions.
- Validating the user's answers.
- Generating a random question when requested.
- Creating and Logging in users.
- Keeping track of user scores.
- Keeping track of the user's old used questions so that they can't be used again.

### Updating the default questions
> Note: The questions get added to the database once the first request is made to the server.

You can update the default questions at `src/other/defaultQuestions.json`.

But the questions should be in the format of

```json
{ 
id: string, 
question: string, 
options: Array<{ 
               label: string, 
               value: string, 
               isCorrect: boolean }> 
}  
```
