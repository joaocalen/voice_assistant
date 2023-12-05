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

  const response = params.audio
    ? await runSeamlessM4T(params)
    : await runLlama(params);

  // Convert the response into a friendly text-stream
  const stream = await ReplicateStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
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

async function runSeamlessM4T({
  task_name,
  input_audio,
  input_text_language,
  max_input_audio_length,
  target_language_text_only,
  target_language_with_speech,
}) {
  console.log("running seamlessm4t");
  return await replicate.predictions.create({
    // IMPORTANT! You must enable streaming.
    version: "668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0",
    stream: true,
    input: {
      task_name: "S2TT (Speech to Text translation)",
      input_audio: "https://replicate.delivery/pbxt/JWSCV0Ai3RX6k2nkLrbQILRQN0zdcJcbFFPmfD8QDzp3xZaf/sample_input.mp3",
      input_text_language: "None",
      max_input_audio_length: 60,
      target_language_text_only: "Norwegian Nynorsk",
      target_language_with_speech: "French"
    },        
  });
  
}