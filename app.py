import flask
import pandas as pd
import sqlalchemy
import joblib
import numpy as np
import plotly as plt
import matplotlib.pyplot as plt
import plotly.express as px
from flask import Flask, jsonify, render_template, request
from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField, IntegerField, FloatField
from wtforms.validators import DataRequired
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression



class PredictorForm(FlaskForm):
    deadout = IntegerField('Deadout', validators=[DataRequired()])
    cc_syn = IntegerField('Colony Collapse', validators=[DataRequired()])
    pest = FloatField('Pesticides', validators=[DataRequired()])
    temps = FloatField('Inclimate Days', validators=[DataRequired()])
    num_colonies = IntegerField('Total Colonies', validators=[DataRequired()])
    submit = SubmitField('Submit')


model_dict = joblib.load('melissa/final_model.sav')

engine = create_engine("sqlite:///the_hive.db")
session = Session(engine)

app = Flask(__name__)

app.config['SECRET_KEY'] = 'C2HWGVoMGfNTBsrYQg8EcMrdTimkZfAb'

@app.route("/", methods=['GET','POST'])
def homepage():
    form = PredictorForm()

    if request.method == 'POST':
        deadout_val = form.deadout.data
        ccsyn_val = form.cc_syn.data
        pest_val = form.pest.data
        temp_val = form.temps.data
        colony_val = form.num_colonies.data

        predicted_value = Predict(form)

    
        return render_template('index.html', form = form, predicted=predicted_value)
    else:
        return render_template('index.html', form = form)


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

@app.route("/api/v1.0/decline", methods=['GET'])
def decline():
    decline_data = pd.read_sql('SELECT * FROM decline WHERE year = 2019', con=engine)
    
    decline_dict = decline_data.to_dict('records')

    return jsonify(decline_dict)
    
    session.close()


@app.route("/data", methods=['GET', 'POST'])

def Predict(honey):
    deadout_val_df = honey.deadout.data
    ccsyn_val_df = honey.cc_syn.data
    pest_val_df = honey.pest.data
    temp_val_df = honey.temps.data
    colony_val_df = honey.num_colonies.data


    honey_predict_df = pd.DataFrame({
        'deadout': [deadout_val_df],
        'cc_syn': [ccsyn_val_df],
        'pesticides': [pest_val_df],
        'count_colonies': [colony_val_df],
        'extreme_temp_days': [temp_val_df]
    })

    hive = model_dict['model']
    X_Scaler = model_dict['scaler']
    predict_df_scaled = X_Scaler.transform(honey_predict_df)
    predicted = hive.predict(predict_df_scaled)

    return predicted


@app.route("/andrew", methods=['GET', 'POST'])
def test():
    return render_template('test.html')


if __name__ == "__main__":
    app.run(debug=True)