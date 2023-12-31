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
  // params.input_audio = params.input_audio == null ? "data:audio/wav;base64,A" : params.input_audio;
  const response = params.input_audio == null ? params.input_text_language == 'English' ? await runStyletts2(params) : await runSeamlessText(params) :  await runSeamlessAudio(params);
  // console.log(params)
  // const response = await runSeamlessM4T(params);
  let prediction = await replicate.predictions.get(response.id);
  
  while(prediction.status == "processing" || prediction.status == "starting" ){
    prediction = await replicate.predictions.get(response.id);
    console.log("checking: " + prediction.status);
  }  
  console.log(prediction);
  
  if (prediction.status == "succeeded")
  {
    if(params.input_audio == null && params.input_text_language == 'English')
      return new Response("audio:"+ prediction.output);
    else if(params.input_audio == null)
      return new Response("audio:"+ prediction.output.audio_output);
    else
      return new Response("text:"+ prediction.output.text_output);
  }
  else
    return new Response("Sorry, something went wrong. Please try again.");  
}

async function runSeamlessAudio({
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

async function runSeamlessText({
  task_name,
  input_text,
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
      input_text: input_text,
      input_text_language: input_text_language,
      max_input_audio_length: max_input_audio_length,
      target_language_text_only: target_language_text_only,
      target_language_with_speech: target_language_with_speech
    },
    
  });
}

async function runStyletts2({
  input_text,
}){
  console.log("running Styletts2");
return await replicate.predictions.create({
  version: "dd4d03b097968361dda9b0563716eb0758d1d5b8aeb890d22bd08634e2bd069c",
  input: {
    text: input_text
  },  
});
}