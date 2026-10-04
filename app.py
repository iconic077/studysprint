from __future__ import annotations

from datetime import datetime
from random import choice

from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder=".", static_url_path="")

MOTIVATION = [
    "One focused session is more valuable than a perfectly planned day.",
    "Start small. The next twenty-five minutes can change the shape of your week.",
    "Clarity comes after you begin, not before.",
    "Make the task smaller, then make the first move.",
]


@app.get("/")
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/motivation")
def motivation():
    return jsonify({"message": choice(MOTIVATION), "generated_at": datetime.now().isoformat()})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "app": "StudySprint"})


if __name__ == "__main__":
    app.run(debug=True)

