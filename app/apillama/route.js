import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error(
    "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
  );
}

export const runtime = "edge";

export async function POST(req) {
  const params = await req.json();

  console.log(params.audio)

  const response = await runLlama(params);

  // Convert the response into a friendly text-stream
  console.log("response");
  console.log(response);
  console.log("====");

  const stream = await ReplicateStream(response);
  return new StreamingTextResponse(stream);
  //
  // Respond with the stream  
}

async function runLlama({
  prompt,
  systemPrompt,
  maxTokens,
  temperature,
  topP,
  version,
}) {
  console.log("running llama");
  return await replicate.predictions.create({
    // IMPORTANT! You must enable streaming.
    stream: true,
    input: {
      prompt: `${prompt}`,
      system_prompt: systemPrompt,
      max_new_tokens: maxTokens,
      temperature: temperature,
      repetition_penalty: 1,
      top_p: topP,
    },
    // IMPORTANT! The model must support streaming. See https://replicate.com/docs/streaming
    version: version,
  });
}