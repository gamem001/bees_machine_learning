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
  # read in sql tables with pandas
    colony_data = pd.read_sql('SELECT * FROM colony', con=engine)
    state_code = pd.read_sql('SELECT * FROM states', con=engine)

    # remove US TOTAL and OTHER STATES values
    colony_data_2 = colony_data.loc[colony_data["state"] != 'US TOTAL']
    colony_data_clean = colony_data_2.loc[colony_data_2["state"] != 'OTHER STATES']

    # merge colony with states
    colony_w_state = pd.merge(colony_data_clean, state_code, on = 'state', how = 'left')
    
    #sort by year descending
    colony_w_state_sorted = colony_w_state.sort_values(by=['year'])

    colony_dict = colony_w_state_sorted.to_dict('records')

    return jsonify(colony_dict)
    
    session.close()  
    

@app.route("/api/v1.0/commo", methods=['GET'])
def food():
    crops = pd.read_sql('SELECT * FROM colony_commodities', con=engine)
    
    commodity_sort = crops.sort_values(by=['count_colonies'])

    colony_dict = commodity_sort.to_dict('records')
    return jsonify(colony_dict)
    
    session.close()

@app.route("/api/v1.0/honey", methods=['GET'])
def honey():
    honey_data = pd.read_sql('SELECT * FROM honey_prod', con=engine)
    state_code = pd.read_sql('SELECT * FROM states', con=engine)

    honey_data_2 = honey_data.loc[honey_data["state"] != 'US TOTAL']
    honey_data_clean = honey_data_2.loc[honey_data_2["state"] != 'OTHER STATES']
    
    honey_w_state = pd.merge(honey_data_clean, state_code, on = 'state', how = 'left')
    honey_w_state_sorted = honey_w_state.sort_values(by=['year'])

    honey_dict = honey_w_state_sorted.to_dict('records')

    return jsonify(honey_dict)
    
    session.close()

@app.route("/api/v1.0/decline", methods=['GET'])
def decline():
    decline_data = pd.read_sql('SELECT * FROM decline WHERE year = 2019', con=engine)
    
    decline_dict = decline_data.to_dict('records')

    return jsonify(decline_dict)
    
    session.close()

@app.route("/charts", methods=['GET'])

def charts():
    return render_template("charts.html")

@app.route("/visualizations", methods=['GET'])

def visualizations():
    return render_template("visualizations.html")

@app.route("/ml_walkthrough", methods=['GET'])

def ml_walkthrough():
    return render_template("ml_walkthrough.html")

@app.route("/data_used", methods=['GET'])

def data_used():
    return render_template("data_used.html")

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

if __name__ == "__main__":
    app.run(debug=True)