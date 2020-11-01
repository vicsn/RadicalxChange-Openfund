#!/bin/bash

python /backend/quadraticfundingapi/manage.py makemigrations
python /backend/quadraticfundingapi/manage.py migrate
python /backend/quadraticfundingapi/manage.py loaddata /backend/quadraticfundingapi/sampledata.json
python /backend/quadraticfundingapi/manage.py runserver 0.0.0.0:8000

