# RadicalxChange-Openfund

Repo for RadicalxChange-Openfund

## Deploy Instructions 

1. Export .env file to enviroment and fill up suitable environment variables

```
cp .env.test .env
```

2. Build Images and Stand up containers

```
docker-compose up --build
```

Note - If images are already present ```docker-compose up```

The Project is now up and running - 

Backend API - http://127.0.0.1:8000

Frontend - http://localhost:3000

3. Create a New superuser for Backend API

```docker exec -it quadraticfunding_api_1 quadraticfundingapi/manage.py createsuperuser```

## API Docs 

- Swagger Docs - http://127.0.0.1:8000/swagger/
- Redoc Docs - http://127.0.0.1:8000/redoc/


---

## Deployment From Scratch

1. Install Docker - 
2. Install docker-compose (Version > 1.25.5) `docker-compose --version`
3. Clone Project - 
```
git clone https://github.com/vicsn/RadicalxChange-Openfund
```
4. Set up [Google Firebase Account](https://firebase.google.com) account.
5. Set up [Sendgrid](https://sendgrid.com) account.
6. Set up [Stripe](https://stripe.com) account.

*Build Project Following Above Instructions*

## Adding projects

> :warning: **The contents of the .env file should not be shared publicly**

1. Go to <backend_url>/add_business_csv/<token>, whereby `token` is the ADD_BUSINESS_CSV_TOKEN set in .env
2. Upload a CSV file with business data, see `backend/downtownapi/samplecompany.csv` for an example
