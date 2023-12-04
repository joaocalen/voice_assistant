    ## For portuguese = tgt_lang="por"

    #text_inputs = processor(text = llama_output, src_lang="eng", return_tensors="pt")
    #audio_array_from_text = model.generate(**text_inputs, tgt_lang="eng")[0].cpu().numpy().squeeze()
    #sample_rate = model.sampling_rate
    #scipy.io.wavfile.write("llama_output.wav", rate=sample_rate, data=audio_array_from_text)
