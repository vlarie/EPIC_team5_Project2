#######################################################
################  Flask Application  #################
##################  Dependencies  ###################
####################################################

import os

import pandas as pd
import numpy as np
import json

from flask import Flask, jsonify, render_template

# To access Heroku config variables
from boto.s3.connection import S3Connection
API_KEY = S3Connection(os.environ['API_KEY'])

app = Flask(__name__)



#######################################################
###################  App Routes  #####################
#####################################################

@app.route("/")
def index():
    print("Return the homepage")
    return API_KEY, render_template("explore.html")


# This route displays the main dashboard users may interact with
@app.route("/explore/")
def dashboard():
    print()

    return API_KEY, render_template("explore.html")

# Route for geoJSON data
@app.route('/jsonifiedGeo/')
def geoJSONIFIED():
    print("Preparing geoJSON for mapping")
    f = open('static/data/EPIC_data_1405.geojson', 'r')

    return f.read()


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

  # Zillow and commute data
  zillCommDF = csvDF("./static/data/zillowCommuteData.csv")
  jsonZillComm = json.loads(zillCommDF.to_json(orient='records'))

  # Crime data
  crimeDF = csvDF("./static/data/crimeData.csv")
  jsonCrime = json.loads(crimeDF.to_json(orient='records'))

  # School data
  schoolDF = csvDF("./static/data/schoolDataFINAL.csv")
  jsonSchool = json.loads(schoolDF.to_json(orient='records'))

  return jsonify(jsonZillComm, jsonCrime, jsonSchool)


# This route displays dynamic timelapse map of Austin properties
# as well as general trends observed
@app.route("/trends")
def trends():
    print()
    return render_template("trends.html")


if __name__ == "__main__":
    app.run(debug=True)