import asteval

from flask import request
from flask import Flask, render_template
from flask import jsonify

app = Flask(__name__)

@app.route('/')
def open_calculator():
    return render_template('calculator.html')

@app.route('/calculate', methods=['POST'])
def calculator():
    data = request.get_json()
    expr = data.get('expression')
    result = eval(expr)
    return jsonify({'result': result})

@app.route('/test-css')
def test_css():
    return app.send_static_file('calculator.css')

if __name__ == "__main__":
    app.run(debug=True)