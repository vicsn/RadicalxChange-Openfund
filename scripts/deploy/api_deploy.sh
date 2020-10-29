python /backend/quadraticfundingapi/manage.py makemigrations
python /backend/quadraticfundingapi/manage.py migrate
python /backend/quadraticfundingapi/manage.py loaddata /backend/quadraticfundingapi/productiondata.json
python /backend/quadraticfundingapi/manage.py collectstatic --noinput
gunicorn --workers=3 quadraticfundingapi.wsgi:application --bind 0.0.0.0:8000
