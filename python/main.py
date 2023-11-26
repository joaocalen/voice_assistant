from llama_chat import llama_inference
from llama import Llama, Dialog
import fire

if __name__ == "__main__":
    ckpt_dir = ""
    tokenizer_path = ""
    generator = Llama.build(
        ckpt_dir=ckpt_dir,
        tokenizer_path=tokenizer_path,
        max_seq_len=512,
        max_batch_size=8,
    )
    fire.Fire(llama_inference(generator))