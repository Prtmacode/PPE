from flask import Flask, request, jsonify
import openai
import base64
import os
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Masukkan API key OpenAI kamu
openai.api_key = "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"

@app.route("/analyze", methods=["POST"])
def analyze():
    img_path = "snapshoot/tester.jpeg"

    if not os.path.exists(img_path):
        return jsonify({"error": "Gambar tidak ditemukan"}), 404

    try:
        with open(img_path, "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode("utf-8")

        # Kirim ke GPT-4 Vision
        response = openai.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Apakah orang pada gambar menggunakan helm, rompi, topi, dan masker? Jawab hanya dengan 'lengkap' atau 'tidak lengkap'."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=50,
        )

        jawaban = response.choices[0].message.content.strip().lower()
        print("🔍 Jawaban AI:", jawaban)

        if "lengkap" in jawaban:
            try:
                requests.get("http://100.81.27.112:3000/lampu/2/on", timeout=2)
                print("✅ Lampu hijau dinyalakan")
                return jsonify({
                    "status": "lengkap",
                    "action": "Lampu hijau berhasil dinyalakan"
                })
            except Exception as e:
                print("⚠️ Gagal nyalakan lampu:", e)
                return jsonify({
                    "status": "lengkap",
                    "action": "Gagal menyalakan lampu"
                })

        else:
            try:
                requests.get("http://100.81.27.112:3000/bicara", timeout=2)
                print("🔊 Suara berhasil dibunyikan")
                return jsonify({
                    "status": "tidak lengkap",
                    "action": "Suara berhasil dibunyikan"
                })
            except Exception as e:
                print("⚠️ Gagal bunyikan suara:", e)
                return jsonify({
                    "status": "tidak lengkap",
                    "action": "Gagal membunyikan suara"
                })

    except Exception as e:
        print("❌ Terjadi error saat analisis:", e)
        return jsonify({"error": "Gagal menganalisis gambar"}), 500

if __name__ == "__main__":
    app.run(debug=True)
