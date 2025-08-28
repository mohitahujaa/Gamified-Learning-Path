from flask import Flask
from routes.skills import skills_bp   # import blueprint

app = Flask(__name__)
app.register_blueprint(skills_bp, url_prefix="/skills")

if __name__ == "__main__":
    app.run(debug=True) 