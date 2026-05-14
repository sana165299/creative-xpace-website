from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

# Your Groq API Key
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)