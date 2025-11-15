from flask import Flask, render_template, request
from functionApp import preprocess,Mapping_NObeyesdad
import os,joblib,pandas as pd
model = joblib.load("static/model/obesityPrediction.pkl")
scaler, num_cols, cat_cols = joblib.load("static/model/scaler.pkl")

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predictObesity', methods=["GET", "POST"])
def obsityPredict():
    ResultPred = None
    if request.method == "POST":
        form_input = request.form.to_dict()
        df = preprocess(form_input)

        # scale hanya kolom numerik
        df[num_cols] = scaler.transform(df[num_cols])
        pred = model.predict(df)[0]

        # mapping hasil prediksi
        ResultPred = Mapping_NObeyesdad[pred]
        print("Prediksi:", ResultPred)
    return render_template("page_obstyPredict.html", hasil=ResultPred)

@app.route('/exercisePlan')
def exercisePlan():
    return render_template('exercise_plan.html')

if __name__ == '__main__':
    app.run()