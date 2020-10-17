#!/bin/bash

function remove_two_newest_files()
{
  rm -rf "$(stat -c "%Y:%n" /backend/downtownapi/main/migrations/* | sort -t: -n | tail -1 | cut -d: -f2-)"
  rm -f "$(stat -c "%Y:%n" /backend/downtownapi/main/migrations/* | sort -t: -n | tail -1 | cut -d: -f2-)"
}

trap remove_two_newest_files EXIT

backend/downtownapi/main/migrations/0016_auto_20201015_1742.py

python /backend/downtownapi/manage.py makemigrations
python /backend/downtownapi/manage.py migrate
python /backend/downtownapi/manage.py loaddata /backend/downtownapi/sampledata.json
python /backend/downtownapi/manage.py runserver 0.0.0.0:8000

sleep infinity # We sleep now, on shutdown we call the trap to clean up the temporary database migration
