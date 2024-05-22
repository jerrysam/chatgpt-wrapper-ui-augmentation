# ChatGPT with UI Automations

## Origin story

I met a startup I really wanted to work with (which doesn't happen a lot), but the founder only needed software engineering roles at the moment. I said I'd be happy to code so he said "okay, show me a codebase (or make one) for me to review. Bonus points for demonstrating you understand how LLMs work, using GPT-4o, and for it being a cool project."

## Vision

ChatGPT has had tools (e.g. a calculator) for a while now, but I haven't seen it controlling the UI (User Interface) yet. I've also wanted to build an LLM-controlled [Fritz bot](https://youtu.be/emfvzUJiMLw?si=EeORnC7WQDKNnH1J), which requires controlling the UI in order to control the robot, so this repo can actually be used for a practical and fun desktop toy robot!

More seriously, since I once built the growth operating system for a YC W21 browser automation startup, I knew the benefits of UI automation. However, multi-agent systems might make browser automation so much better that it would create an inflection point in growth.

So, what do we imagine it doing?

- Offer "smart replies": A button that sends your most likely response (e.g. "break down the first step of that plan")
- Animate sentiment: If you and ChatGPT just got code working, animate a confetti explosion to celebrate!
- Interactive charts: Display an inline pie chart you can hover over to reveal the value of each slice
- Control web apps: As a sidebar in gmail, it could trigger a script that selects all unread newsletters and marks them as read.
- And of course, make a Fritz bot track my face and remember the moments I got excited!

<img src="https://i.postimg.cc/qRYFDGXT/Fritzbot.png" height="200">

## Demo

Visit the [Demo Site](https://bit.ly/gpt-browser-automation)

**Watch demo video:** (Open this link in a new tab)

[<img src="https://img.youtube.com/vi/e-lzydeDF0s/maxresdefault.jpg" target="_blank">](https://youtu.be/e-lzydeDF0s)

## How its built

1. Create some UI mockups to plan the project (see below)
2. Clone [ChatGPT Lite repo](https://github.com/blrchen/chatgpt-lite) (163 stars, 75 forks, 7 contributors, updated 2 weeks ago, clean code)
3. Implement custom prompt in useChatHook.ts, for the LLM to return augmentation triggers
4. Intercept the augmentation code during streaming, prevent the user seeing it, and trigger the augmentation
5. Write a couple augmentations that can be triggered, test, refactor, and deploy to Vercel!

**Original UI mockups:**

<img src="https://i.postimg.cc/bvBL3x7P/Augment-Button.png" height="300"><img src="https://i.postimg.cc/mrD8YX6V/Augment-Chart.png" height="300"><img src="https://i.postimg.cc/T3QtWMQp/Augment-Fritz-Robot-Commands.png" height="300">

## Implementation decisions

- By using an open source repo, we're able to build large projects quickly and familiarise myself with other peoples code (or other agents).
- By merging the response and augmentation in one message, we significantly reduce the required LLM calls
- By asking the LLM for a JSON object instead of code, we reduce security risks by writing and approving executed code separately before loading into the client. It also reduces the burden for a single LLM response to have a great answer and lots of working code.
- I decided not to optimise any inherited code unless I edited it, and I continued the same style as the inherited repo. I did optimise my own code for performance, readibility, and simplicity (DRY).

## Future work

**To do:**

- Test on mobile and across browsers
- Full response in JSON?: Explore whether I get better performance asking LLM for a JSON object with "reply" and "augmentation", then implement the better one. Risk that when JSON is invalid, the user sees nothing or a full object in this case.
- Update steamingAugmentation code with a buffer that operates at a 3 "char" delay, so the delimiter never flashes on the screen..
- Implement a UI automation (e.g. close sidebar)
- Log chats for analysis: Log all the ways others chat with this bot and adapt the prompt accordingly (now I wish I had a backend and logging message history)
- Transform into a chrome extension that creates a sidebar in another chat UI (if multi-agent systems can write good enough frontend automations), and trigger automations in any web app
- Edit to a "Bring Your Own Key" model
- [DONE] Add chain of thought and/or least to most reasoning (refer to Data Analyst for example), to run conditionally on complex tasks (to save token cost)
- [DONE] Implement an interactive chart

**Long term:**

- UI automations can be written by multi-agent systems to iterate until working. They can have a browser tool available to them in order to test their code, look at the DOM, and also tkae screenshots for coordinates of where to click, since GPT-4o has much better vision capabilities.

## Prompt engineering notes

**The prompt, with comments**

LLMs perform better if told they are experts

> You are an expert in UI animations and code.

Main instructions at the top, which has more weighting. Don't put the example far at the end (far from the main prompt), because the additional distance reduces its weight.

Found a relatively unique string as a delimiter

"Valid JSON" makes it more likely to provide a usable string

> At the end of your message, provide a ^~/^\ delimiter then a valid JSON object.

One shot examples make it more likely to work

The augmentation is after the message, because it doesn't know what the message will be until it's predicted all those tokens.

> for example:
> "
> Message goes here
>
> ^~/^\
>
> {"augmentation": "response-button", "data": {"buttonText": "break down first step", "responseText": "Can you break down the first step in more detail?"}}' }
>
> "

A JSON schema makes it even more likely to work, and communicates all the available options

> All responses must follow this schema:
>
> type Schema = {
>
> augmentation: 'response-button'
>
> data: {
>
> 'buttonText': string
>
> 'responseText': string
>
> }
>
> } | {
>
> augmentation: 'animation'
>
> data: 'Yes' | 'No' | 'Excitement' | 'Success'
>
> }

Cover the edge cases with prompts and negative prompts at the end

Use caps to improve compliance to this long tail of guidelines

> EVERY reply MUST be formatted with your text reply to the user, THEN JSON object to match the JSON schema below.

> You MUST ALWAYS have a user-facing response reply.

> You reply MUST be above the delimiter. Don't write anything other than a json object after the delimiter.

> Your JSON object MUST be below a delimiter.

> There can only be one JSON object per message

## Learnings for multi-agent programming systems

Since I used chatGPT to help me code (when it understood the problem well enough), I logged my learnings about how it works today and how to get it working better in a multi-agent context:

1.  It has a tendency to use deprecated code, probably because there's more of it on the internet (which is the training data). Prompt agents to use newer code (it helped for me)
2.  It has a tendency to solve problems with more code, which could become a whack-a-mole of spaghetti code. What prompts could make it remove code?

    - Maybe an agent can take a diff from the last working version and suggest what code is extraneous, wrong, or could be refactored.

3.  Working code has multiple reasons for being written the way it is. ChatGPT might only detect some of those reasons, and implement changes that break the remaining reasons. What prompts could avoid this?
    - Would it help if there was a spec for each part of the code? Perhaps a huge amount of comments in the codebase? Could that spec be generated at the time of editing?

AutoML engineer system and prompts outlined in this blog: https://lilianweng.github.io/posts/2023-06-23-agent/

## Prerequisites

You need an OpenAI or Azure OpenAI account.

## Deployment

Refer to the [Environment Variables](#environment-variables) section for necessary environment variables.

### Deploy on Vercel

Click the button below to deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fblrchen%2Fchatgpt-lite&project-name=chatgpt-lite&framework=nextjs&repository-name=chatgpt-lite)

### Deploy with Docker

For OpenAI account users:

```

docker run -d -p 3000:3000 \
 -e OPENAI_API_KEY="<REPLACE-ME>" \
 blrchen/chatgpt-lite

```

For Azure OpenAI account users:

```

docker run -d -p 3000:3000 \
 -e AZURE_OPENAI_API_BASE_URL="<REPLACE-ME>" \
 -e AZURE_OPENAI_API_KEY="<REPLACE-ME>" \
 -e AZURE_OPENAI_DEPLOYMENT="<REPLACE-ME>" \
 blrchen/chatgpt-lite

```

## Development

### Running Locally

1. Install NodeJS 20.
2. Clone the repository.
3. Install dependencies with `npm install`.
4. Copy `.env.example` to `.env.local` and update environment variables.
5. Start the application using `npm run dev`.
6. Visit `http://localhost:3000` in your browser.

### Running Locally with Docker

1. Clone the repository and navigate to the root directory.
2. Update the `OPENAI_API_KEY` environment variable in the `docker-compose.yml` file.
3. Build the application using `docker-compose build .`.
4. Start it by running `docker-compose up -d`.

## Environment Variables

Required environment variables:

For OpenAI account:

| Name                | Description                                                                                             | Default Value            |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| OPENAI_API_BASE_URL | Use if you plan to use a reverse proxy for `api.openai.com`.                                            | `https://api.openai.com` |
| OPENAI_API_KEY      | Secret key string obtained from the [OpenAI API website](https://platform.openai.com/account/api-keys). |
| OPENAI_MODEL        | Model of GPT used                                                                                       | `gpt-3.5-turbo`          |

For Azure OpenAI account:

| Name                      | Description                                    |
| ------------------------- | ---------------------------------------------- |
| AZURE_OPENAI_API_BASE_URL | Endpoint (e.g., https://xxx.openai.azure.com). |
| AZURE_OPENAI_API_KEY      | Key                                            |
| AZURE_OPENAI_DEPLOYMENT   | Model deployment name                          |

## Contribution

PRs of all sizes are welcome.
Issues (bug reports and suggestions) also welcome.
