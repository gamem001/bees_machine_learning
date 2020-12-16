import flask 
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import numpy as np
import pandas as pd

engine = create_engine("sqlite:///the_hive.db")
session = Session(engine)

app = Flask(__name__)

decline_data = pd.read_sql('SELECT * FROM decline', con=engine)


@app.route("/", methods=['GET'])
def homepage():
    return render_template('index.html')

@app.route("/home", methods=['GET'])
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
def colonies():
    return
    

@app.route("/api/v1.0/commo", methods=['GET'])
def commodities():
    return

@app.route("/api/v1.0/honey", methods=['GET'])
def honey():
    return
    



@app.route("/api/v1.0/mrkt", methods=['GET'])
def mrkt():
    return
    


@app.route("/api/v1.0/temp", methods=['GET'])
def temp():
    return


@app.route("/api/v1.0/decline", methods=['GET'])
def decline():
    
    decline_dict = decline_data.to_dict('records')

    return jsonify(decline_dict)
    
    session.close()

if __name__ == "__main__":
    app.run(debug=True)