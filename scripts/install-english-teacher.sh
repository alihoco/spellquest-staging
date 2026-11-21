set -eu
[ "${RENDER_SERVICE_NAME:-}" = spellquest-voice-staging ] || exit 0
mkdir -p .teacher
python3 -m venv .teacher/runtime
.teacher/runtime/bin/pip install --disable-pip-version-check 'piper-tts==1.8.0'
base=https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_GB/southern_english_female/low/en_GB-southern_english_female-low
for ext in onnx onnx.json; do
  curl -fLsS --retry 3 "$base.$ext?download=true" -o ".teacher/teacher.$ext"
done
echo 'f2f37aed1b3a093476f719d1379ba0c0b1b1cf6f1ef99288e2ebf502971a07c3  .teacher/teacher.onnx' | sha256sum -c -
echo 'a1af43310f8756161506e849a2863d342a98b0853af9e2437581d39e9922d0e5  .teacher/teacher.onnx.json' | sha256sum -c -
