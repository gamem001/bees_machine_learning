import flask 
from flask import Flask, jsonify, render_template
from flask_cors import cross_origin 

# Setup Flask
# Create an app, pass to __name__
app = Flask(__name__)

@app.route("/", methods=['GET'])
@cross_origin()
def homepage():
    return render_template('index.html')

@app.route("/home", methods=['GET'])
@cross_origin()
def welcome():
    return(
        f"The Hive<br/>"
        f"Avaialble Routes:<br/>"
        f"/api/v1.0/col<br/>"
        f"/api/v1.0/commo<br/>"
        f"/api/v1.0/honey<br/>"
        f"/api/v1.0/mrkt<br/>"
        f"/api/v1.0/temp<br/>"
        f"/api/v1.0/decline<br/>"
)

@app.route("/api/v1.0/col", methods=['GET'])
@cross_origin()
def colonies():
    


@app.route("/api/v1.0/commo", methods=['GET'])
@cross_origin()
def commodities():
    



@app.route("/api/v1.0/honey", methods=['GET'])
@cross_origin()
def honey():
    



@app.route("/api/v1.0/mrkt", methods=['GET'])
@cross_origin()
def mrkt():
    


@app.route("/api/v1.0/temp", methods=['GET'])
@cross_origin()
def temp():
    return


@app.route("/api/v1.0/decline", methods=['GET'])
@cross_origin()
def temp():
    return




if __name__ == "__main__":
    app.run(debug=True)