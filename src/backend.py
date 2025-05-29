import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

app = Flask(__name__)
CORS(app)


@app.route('/caption', methods=['POST'])
def caption():
    uploaded_image = request.files.get('image')
    try:
        data = uploaded_image.read()
        image_part = types.Part.from_bytes(
            data=data,
            mime_type=uploaded_image.mimetype
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-05-20",
            contents=[image_part, "Caption this image in 10 words"],
        )
        return jsonify({"caption": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
