"""Render a teacher utterance using the Southern English Female Piper voice."""
import io
import json
import sys
import wave
from pathlib import Path

import onnxruntime
from piper import PiperVoice
from piper.config import PiperConfig

model = Path(sys.argv[1])
options = onnxruntime.SessionOptions()
options.intra_op_num_threads = 1
options.inter_op_num_threads = 1
voice = PiperVoice(config=PiperConfig.from_dict(json.loads(Path(str(model) + ".json").read_text())),
                   session=onnxruntime.InferenceSession(str(model), sess_options=options,
                                                        providers=["CPUExecutionProvider"]))
output = io.BytesIO()
with wave.open(output, "wb") as wav:
    voice.synthesize_wav(sys.stdin.read(), wav)
sys.stdout.buffer.write(output.getvalue())
