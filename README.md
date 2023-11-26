# voice_assistant
Voice assistant to record someone's speech in any language, translate it to english text, use this text as input in a llama model and return the output as speech in the same language used in input
# Llama Chat 🦙

This is a [Next.js](https://nextjs.org/) app that demonstrates how to build a chat UI using the [Llama 2](https://replicate.com/replicate/llama70b-v2-chat) language model and Replicate's [streaming API (private beta)](https://replicate.com/docs/streaming).

Here's a demo:

https://github.com/replicate/llama-chat/assets/14149230/9c6aaef3-4e60-4846-a2d2-f9575e155b70


## Usage

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

