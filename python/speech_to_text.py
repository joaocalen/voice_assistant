import scipy
import torchaudio
import torch
from transformers import AutoProcessor, SeamlessM4TModel

def s2t(audio_path, model="large"):
    if model == "large":
        model = SeamlessM4TModel.from_pretrained("facebook/hf-seamless-m4t-large")
        #device = "cuda:0" if torch.cuda.is_available() else "cpu"
        #model = model.to(device)
        processor = AutoProcessor.from_pretrained("facebook/hf-seamless-m4t-large")
    else:
        model = SeamlessM4TModel.from_pretrained("facebook/hf-seamless-m4t-medium")
        #device = "cuda:0" if torch.cuda.is_available() else "cpu"
        #model = model.to(device)
        processor = AutoProcessor.from_pretrained("facebook/hf-seamless-m4t-medium")    

    waveform, sample_rate = torchaudio.load(audio_path)

    ## downsampling the audio to work
    audio = torchaudio.functional.resample(waveform, orig_freq=sample_rate, new_freq=model.config.sampling_rate)

    audio_inputs = processor(audios=audio, sampling_rate=model.config.sampling_rate, return_tensors="pt")

    output_tokens = model.generate(**audio_inputs, tgt_lang="eng", generate_speech=False)
    translated_text_from_audio = processor.decode(output_tokens[0].tolist()[0], skip_special_tokens=True)
    print(f"Translation from audio: {translated_text_from_audio}")

    return translated_text_from_audio   

