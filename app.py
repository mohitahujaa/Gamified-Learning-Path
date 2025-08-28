from flask import Flask
from flask_cors import CORS
from routes.skills import skills_bp   # import blueprint

app = Flask(__name__)
CORS(app)
app.register_blueprint(skills_bp, url_prefix="/skills")

if __name__ == "__main__":
    app.run(debug=True) 