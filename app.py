# serve.py

from flask import Flask
from flask import render_template

# creates a Flask application, named app
app = Flask(__name__)

# a route where we will display a welcome message via an HTML template
@app.route("/")
def Traveling_Golfer():
    return render_template('Traveling_Golfer.html')

@app.route("/stats")
def stats():
    return render_template('index.html')

# run the application
if __name__ == "__main__":
    app.run(debug=True)