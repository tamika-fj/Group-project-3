#import dependencies
import numpy as np
import sqlalchemy

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

#Create engine to database
engine=create_engine("sqlite:///ww_cigarette_database.sqlite")


# Reflect Database into new model
Base = automap_base()

#Reflect the tables
Base.prepare(engine,reflect=True)

#Reference to tables
map2000 = Base.classes.coordinates_2000_cleaned 
map2012 = Base.classes.coordinates_2012_cleaned 
smoke = Base.classes.combined_data

#Flask setup
app = Flask(__name__)

#Flask routes

#List of routes
@app.route("/")
def home():
    return(
        f"Available Routes:<br/>"
        f"/api/v1.0/world_smoking_stats_2000<br/>"
        f"/api/v1.0/world_smoking_stats_2012<br/>"
        f"/api/v1.0/socioeconomic_2012<br/>"   
        #f"/api/v1.0/socioeconomic_all_years<br/>" 
    )


#List of smoking data for each country based on year and gender


@app.route("/api/v1.0/world_smoking_stats_2000")
def world_smoking_stats_2000():
    session=Session(engine)
    results=session.query(map2000.CountryName, map2000.Year, map2000.PercentageOfSmokersInMalePopulation, map2000.PercentageOfSmokersInFemalePopulation, map2000.PercentageOfSmokersInPopulation, map2000.Coordinates).all()
    session.close()
    
    all_smoking_data_2000=[]
    for CountryName, Year, PercentageOfSmokersInMalePopulation,PercentageOfSmokersInFemalePopulation, PercentageOfSmokersInPopulation, Coordinates in results:
        id_dict={}
        id_dict["CountryName"]=CountryName
        id_dict["Year"]=Year
        id_dict["Percentage Males"]=PercentageOfSmokersInMalePopulation
        id_dict["Percentage Females"]=PercentageOfSmokersInFemalePopulation
        id_dict["Percentage Total"]=PercentageOfSmokersInPopulation
        id_dict["Coordinates"]=Coordinates
        all_smoking_data_2000.append(id_dict)
    return jsonify(all_smoking_data_2000)


@app.route("/api/v1.0/world_smoking_stats_2012")
def world_smoking_stats_2012():
    session=Session(engine)
    results=session.query(map2012.CountryName, map2012.Year, map2012.PercentageOfSmokersInMalePopulation, map2012.PercentageOfSmokersInFemalePopulation, map2012.PercentageOfSmokersInPopulation, map2012.Coordinates).all()
    session.close()
    
    all_smoking_data_2012=[]
    for CountryName, Year, PercentageOfSmokersInMalePopulation,PercentageOfSmokersInFemalePopulation, PercentageOfSmokersInPopulation, Coordinates in results:
        id_dict={}
        id_dict["CountryName"]=CountryName
        id_dict["Year"]=Year
        id_dict["Percentage Males"]=PercentageOfSmokersInMalePopulation
        id_dict["Percentage Females"]=PercentageOfSmokersInFemalePopulation
        id_dict["Percentage Total"]=PercentageOfSmokersInPopulation
        id_dict["Coordinates"]=Coordinates
        all_smoking_data_2012.append(id_dict)
    return jsonify(all_smoking_data_2012)

#List of smoking data and socio economic factors of each country


#List of smoking data and socio economic factors of each country for year 2012

@app.route("/api/v1.0/socioeconomic_2012")
def socioeconomic_2012():
    session=Session(engine)
    results=session.query(smoke.CountryName, smoke.Year,smoke.PercentageTotal,smoke.GDPPerCapita,smoke.Unemployment,smoke.HealthExpenditure).\
        filter(smoke.Year==2012).all()
    session.close()
    
    year_socio_data=[]
    for CountryName, Year, PercentageTotal, GDPPerCapita, Unemployment, HealthExpenditure in results:
        socio_dict={}
        socio_dict["Country"]=CountryName
        socio_dict["Year"]=Year
        socio_dict["Percentage Total"]=PercentageTotal
        socio_dict["GDP per capita"]=GDPPerCapita
        socio_dict["Unemployment"]=Unemployment
        socio_dict["Health Expenditure"]=HealthExpenditure
        year_socio_data.append(socio_dict)
    return jsonify(year_socio_data)

#@app.route("/api/v1.0/socioeconomic_all_years")
#def socioeconomic_all_years():
    #session=Session(engine)
    #results=session.query(smoke.Country_id, smoke.CountryName, smoke.Year,smoke.PercentageTotal,smoke.GDPPerCapita,smoke.Unemployment,smoke.HealthExpenditure).all()
    #session.close()
    
    #all_socio_data=[]
    #for Country_id, CountryName, Year, PercentageTotal, GDPPerCapita, Unemployment, HealthExpenditure in results:
        #socio_dict={}
        #socio_dict["Country"]=CountryName
        #socio_dict["Year"]=Year
        #socio_dict["Percentage Total"]=PercentageTotal
        #socio_dict["GDP per capita"]=GDPPerCapita
        #socio_dict["Unemployment"]=Unemployment
        #socio_dict["Health Expenditure"]=HealthExpenditure
        #all_socio_data.append(socio_dict)
    #return jsonify(all_socio_data)



  
if __name__ == "__main__":
    app.run(debug=True)

