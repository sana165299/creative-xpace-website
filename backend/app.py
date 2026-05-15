from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from google import genai
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Your Groq API Key
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"reply": "Flask is connected successfully"})

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    user_message = data.get("message")

    try:

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": """
You are Creative Xpace Assistant.

Only answer using this information:

Business Name: Creative Xpace
Location: Islamabad
Phone: 0300-6981093

Services:
- Residential Interior Design
- Office Interior Design
- Kitchen Design
- Bedroom Design
- Living Room Design
- 3D Visualization
- Renovation and Space Planning

Rules:
- Never invent names or fake staff.
- Keep answers short and professional.
- For appointments say:
Please contact us at 0300-6981093 to book your appointment.
"""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        bot_reply = completion.choices[0].message.content

        return jsonify({
            "reply": bot_reply
        })

    except Exception as e:

        return jsonify({
            "reply": str(e)
        })
    
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Creative Xpace API is running"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

@app.route("/analyze-room", methods=["POST"])
def analyze_room():

    try:

        if "image" not in request.files:
            return jsonify({"reply": "No image uploaded"}), 400

        image_file = request.files["image"]

        image = Image.open(image_file)

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                """
                Analyze this room image like a professional interior designer.

                Provide:
                1. Room style
                2. Suggested colors
                3. Furniture improvements
                4. Lighting improvements
                5. Space optimization ideas

Keep response very short. Maximum 5 bullet points. Each bullet should be one line only.                """,
                image
            ]
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        return jsonify({
            "reply": str(e)
        }), 500