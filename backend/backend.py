from flask import Flask, request, jsonify
from flask_cors import CORS
from litellm import completion
import os
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)
CORS(app)

# Set your API key
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBrulOorXX01nH0VVkCV6Ts6hK64EGxyBU")

# Load NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Simple function to clean up and structure responses
def clean_response(response_text):
    response_text = re.sub(r'\s+', ' ', response_text)  # Remove extra spaces
    response_text = response_text.strip()  # Strip extra leading/trailing spaces
    return response_text

# Function to categorize the response using NLP
def classify_response(user_query):
    # Define basic keywords for each category
    keywords = {
        "medical_treatment": ["treatment", "doctor", "medication", "surgery"],
        "home_remedies": ["remedy", "home", "natural", "herbal"],
        "preventive_measures": ["prevent", "prevention", "exercise", "vaccination"],
        "additional_tips": ["tips", "advice", "guide", "suggestions"]
    }
    
    # Tokenize user query and remove stopwords
    tokens = word_tokenize(user_query.lower())
    filtered_tokens = [word for word in tokens if word not in stopwords.words('english')]

    # Check for category keywords in the query
    for category, words in keywords.items():
        if any(word in filtered_tokens for word in words):
            return category
    
    # Default to general response if no category matches
    return "general"

@app.route("/generate-content", methods=["POST"])
def generate_content():
    try:
        data = request.json
        user_content = data.get("content")

        if not user_content:
            return jsonify({"error": "Content is required"}), 400

        # Gemini API call
        try:
            response = completion(
                model="gemini/gemini-pro",
                api_key=API_KEY,
                messages=[{"role": "user", "content": user_content}]
            )
        except Exception as api_error:
            print(f"Gemini API error: {api_error}")
            return jsonify({"error": "Gemini API failed", "details": str(api_error)}), 500

        content_text = response.choices[0].message.content
        content_text = clean_response(content_text)

        if "cause" in user_content.lower():
            return jsonify({
                "response": "Here are the categories related to your health query. Please choose one:",
                "buttons": [
                    {"label": "Medical Treatment", "value": "medical_treatment"},
                    {"label": "Home Remedies and Self-Care", "value": "home_remedies"},
                    {"label": "Preventive Measures", "value": "preventive_measures"},
                    {"label": "Additional Tips", "value": "additional_tips"}
                ]
            }), 200

        return jsonify({"response": content_text}), 200

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    

@app.route("/get-category-info", methods=["POST"])
def get_category_info():
    try:
        data = request.json
        category = data.get("category")

        # Predefined responses for each category
        category_info = {
            "medical_treatment": "Medical treatments include medications, surgeries, and therapies. Consult a healthcare provider for specific treatments.",
            "home_remedies": "Home remedies may include herbal teas, essential oils, and other natural approaches. Always consult your doctor.",
            "preventive_measures": "Preventive measures involve regular exercise, a balanced diet, and avoiding harmful substances.",
            "additional_tips": "Health tips include staying hydrated, managing stress, and getting adequate sleep."
        }

        response_text = category_info.get(category, "No information available.")
        return jsonify({"response": response_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
