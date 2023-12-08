import Replicate from "replicate";

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
  const response = await runSeamlessM4T(params);
  let prediction = await replicate.predictions.get(response.id);
  
  while(prediction.status == "processing" || prediction.status == "starting" ){
    prediction = await replicate.predictions.get(response.id);
    console.log("checking: " + prediction.status);
  }  
  console.log(prediction);
  
  if (prediction.status == "succeeded")
    return new Response(prediction.output.text_output);
  
  else
    return new Response("Sorry, something went wrong. Please try again.");  
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
    version: "668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0",    
    input: {
      task_name: task_name,
      input_audio: input_audio,
      input_text_language: input_text_language,
      max_input_audio_length: max_input_audio_length,
      target_language_text_only: target_language_text_only,
      target_language_with_speech: target_language_with_speech
    },
    
  });
  
}