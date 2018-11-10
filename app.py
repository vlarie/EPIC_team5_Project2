#######################################################
################  Flask Application  #################
##################  Dependencies  ###################
####################################################

import os

import pandas as pd
import numpy as np
import json

from flask import Flask, jsonify, render_template

app = Flask(__name__)



#######################################################
###################  App Routes  #####################
#####################################################

@app.route("/")
def index():
    print("Return the homepage")
    return render_template("index.html")


# This route displays the main dashboard users may interact with
@app.route("/exploration/")
def dashboard():
    print()
    # Funtion for reading CSV in as DataFrame
    def csvDF(oldCSVfilepath):
        csvIN = pd.read_csv(oldCSVfilepath)
        DF = pd.DataFrame(csvIN)
        return DF

    # These reference variables allow for access on html via Jinja
    # Zillow and commute data
    zillowCommDF = csvDF("./data/zillowClean.csv")
    jsonZillowComm = json.loads(zillowCommDF.to_json(orient='records'))

    # Crime data
    crimeDF = csvDF("./data/crimeData.csv")
    jsonCrime = json.loads(crimeDF.to_json(orient='records'))

    # School data
    # schoolDF = csvDF("./data/schoolData.csv")
    # jsonSchool = json.loads(schoolDF.to_json(orient='records'))
    # schools=jsonSchool

    return render_template("tempDev.html", listings=jsonZillowComm, incidents=jsonCrime)


# This route reads in CSVs containing datapoints and converts them to JSON format 
# for easy manipulation with D3 within JS files
@app.route("/jsonifiedData/")
def jsonified():
    print("Formatting CSVs to JSON")
    # Funtion for reading CSV in as DataFrame
    def csvDF(oldCSVfilepath):
        csvIN = pd.read_csv(oldCSVfilepath)
        DF = pd.DataFrame(csvIN)
        return DF

    DF = csvDF("./data/sampleDevData.csv")
    jsonfiles = json.loads(DF.to_json(orient='records'))

    # Zillow and commute data
    zillCommDF = csvDF("./data/zillowClean.csv")
    jsonZillComm = json.loads(zillCommDF.to_json(orient='records'))

    # Crime data
    crimeDF = csvDF("./data/crimeData.csv")
    jsonCrime = json.loads(crimeDF.to_json(orient='records'))

    # School data
    # schoolDF = csvDF("./data/schoolData.csv")
    # jsonSchool = json.loads(schoolDF.to_json(orient='records'))

    return jsonify(jsonZillComm, jsonCrime)


# This route displays dynamic timelapse map of Austin properties
# as well as general trends observed
@app.route("/trends")
def trends():
    print()
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)