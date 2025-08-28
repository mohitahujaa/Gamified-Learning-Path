from flask import Flask
from flask_cors import CORS
from routes.test import test_bp
from routes.skills import skills_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(test_bp)
app.register_blueprint(skills_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)