#######################################################
################  Flask Application  #################
##################  Dependencies  ###################
####################################################

import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#######################################################
#################  Database Setup  ###################
#####################################################

### @TODO Change filename for sqlite 
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/<filename>.sqlite"
db = SQLAlchemy(app)

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(db.engine, reflect=True)

### @TODO Change to appropriate names for database
# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples


#######################################################
###################  App Routes  #####################
#####################################################

@app.route("/")
def index():
    print("Return the homepage")
    return render_template("./templates/index.html")


@app.route("/exploration")
def dashboard():
    print()
    return render_template("./templates/index.html")


@app.route("/trends")
def trends():
    print()
    return render_template("./templates/index.html")


if __name__ == "__main__":
    app.run()