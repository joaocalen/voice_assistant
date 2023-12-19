# paper
The article about this work is in the file "relatorio.pdf", and the test examples are in the "exemplos" folder.

# voice_assistant
Voice assistant to record someone's speech in any language, translate it to text, use this text as input in a llama model and return the output as speech in the same language used in input
# Llama Chat 🦙

## Usage

Install dependencies: (If you don't have nvm or npm, you can follow this guide: https://medium.com/@imvinojanv/how-to-install-node-js-and-npm-using-node-version-manager-nvm-143165b16ce1)

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local` (create this file, like the `.env.example` file):

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

