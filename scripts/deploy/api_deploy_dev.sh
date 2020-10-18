#!/bin/bash

python /backend/downtownapi/manage.py makemigrations
python /backend/downtownapi/manage.py migrate
python /backend/downtownapi/manage.py loaddata /backend/downtownapi/sampledata.json
python /backend/downtownapi/manage.py runserver 0.0.0.0:8000
