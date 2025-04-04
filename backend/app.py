from flask import Flask, render_template, request, jsonify
import pyautogui
import time

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")

# Global flag to control typing
typing_active = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/type', methods=['POST'])
def type_text():
    global typing_active

    data = request.json
    text = data.get('text')
    delay = int(data.get('delay', 5))  # Default delay is 5 seconds
    speed = float(data.get('speed', 0.025))  # Default speed is 0.025 seconds/character

    print(f"Received speed: {speed}")  # Debugging: Log the speed value

    if not text:
        return jsonify({"status": "error", "message": "No text provided"}), 400

    typing_active = True
    time.sleep(delay)

    for char in text:
        if not typing_active:
            break  # Stop typing if interrupted
        pyautogui.write(char, interval=speed)  # Use the provided typing speed

    typing_active = False
    return jsonify({"status": "success", "message": "Typing simulation completed!"})

@app.route('/stop', methods=['POST'])
def stop_typing():
    global typing_active
    typing_active = False
    return jsonify({"status": "success", "message": "Typing stopped."})

if __name__ == '__main__':
    app.run(debug=True)