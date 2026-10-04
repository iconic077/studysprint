# StudySprint

A polished, local-first study dashboard that makes focused work feel approachable.

## What it does

- Runs a 25-minute focus timer and counts finished sessions
- Organizes study tasks by subject
- Tracks task completion progress
- Saves the dashboard state in the browser
- Uses a small Flask API to serve rotating motivation

## Run locally

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
```

Visit `http://127.0.0.1:5000`.

The frontend uses React, HTML, CSS, and JavaScript. It can also be opened directly as `index.html`; it simply falls back to a built-in quote without the Flask API.

