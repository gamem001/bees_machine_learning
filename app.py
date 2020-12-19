import flask
import pandas as pd
import sqlalchemy
import joblib
from flask import Flask, jsonify, render_template, request
from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField, IntegerField, FloatField
from wtforms.validators import DataRequired
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

class PredictorForm(FlaskForm):
    deadout = IntegerField('Deadout', validators=[DataRequired()])
    cc_syn = IntegerField('Colony Collapse', validators=[DataRequired()])
    pest = FloatField('Pesticides', validators=[DataRequired()])
    temps = FloatField('Temps', validators=[DataRequired()])
    num_colonies = IntegerField('Num of Colonies', validators=[DataRequired()])
    submit = SubmitField('Submit')


# model = joblib.load('melissa/final_model.sav')

engine = create_engine("sqlite:///the_hive.db")
session = Session(engine)

app = Flask(__name__)

# app.config['SECRET_KEY'] = 'C2HWGVoMGfNTBsrYQg8EcMrdTimkZfAb'
@app.route("/", methods=['GET','POST'])
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
    colony_data = pd.read_sql('SELECT * FROM colony', con=engine)
    
    colony_dict = colony_data.to_dict('records')

    return jsonify(colony_dict)
    
    session.close()
    

@app.route("/api/v1.0/commo", methods=['GET'])
def commodities():
    return

@app.route("/api/v1.0/honey", methods=['GET'])
def honey():
    honey_data = pd.read_sql('SELECT * FROM honey_prod', con=engine)
    
    honey_dict = honey_data.to_dict('records')

    return jsonify(honey_dict)
    
    session.close()
    
# @app.route("/api/v1.0/mrkt", methods=['GET'])
# def mrkt():
#     return
    


# @app.route("/api/v1.0/temp", methods=['GET'])
# def temp():
#     return


@app.route("/api/v1.0/decline", methods=['GET'])
def decline():
    decline_data = pd.read_sql('SELECT * FROM decline WHERE year = 2019', con=engine)
    
    decline_dict = decline_data.to_dict('records')

    return jsonify(decline_dict)
    
    session.close()



@app.route("/machine", methods=['GET', 'POST'])
def machinelearning():

    form = PredictorForm()

    if request.method == 'POST':
        deadout_val = form.deadout.data
        ccsyn_val = form.cc_syn.data
        pest_val = form.pest.data
        temp_val = form.temps.data
        colony_val = form.num_colonies.data

        df = Predict(form)
        # session['data'] = df.to_json()

        return render_template('honey.html')
    else:
        return render_template('index.html', form = form)

@app.route("/data", methods=['GET', 'POST'])

def Predict(honey):
    deadout_val_df = honey.deadout_val.data
    ccsyn_val_df = honey.ccsyn_val.data
    pest_val_df = honey.pest_val.data
    temp_val_df = honey.temp_val.data
    colony_val_df = honey.colony_val.data

    honey_predict_df = pd.DataFrame({
        'deadout': [deadout_val_df],
        'cc_syn': [ccsyn_val_df],
        'pesticides': [pest_val_df],
        'count_colonies': [colony_val_df],
        'extreme_temp_days': [temp_val_df]
    })
    # incomes machince learning...sorry
    # return results

if __name__ == "__main__":
    app.run(debug=True)