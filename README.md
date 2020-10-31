# RadicalxChange-Openfund

This is the repository for the RadicalxChange Openfund back- and frontend. With
this app, you can run a Quadratic Funding / Liberal Radicalism crowdfunding
campaign.

> :warning: **The contents of the .env file should not be shared publicly**

## Development instructions

1. Install Docker and Docker Compose (Version > 1.25.5)
2. Rename `.env.test` to `.env` and set all variables with your preferred values.
3. Build images and start containers
```
docker-compose up --build
```
4. Create a New superuser for Backend API
```
docker exec -it quadraticfunding_api_1 quadraticfundingapi/manage.py createsuperuser
```

The Project is now up and listening on:

Backend - http://127.0.0.1:8000
Frontend - http://localhost:3000

## API Documenation instructions 

- Swagger Docs - http://127.0.0.1:8000/swagger/
- Redoc Docs - http://127.0.0.1:8000/redoc/

## Production instructions

1. Acquire domain name and ensure that the root domain, as well as subdomains `api` and `www` are pointing to your server.
2. Install Docker and Docker Compose (Version > 1.25.5)
3. Clone Project
```
git clone https://github.com/vicsn/RadicalxChange-Openfund
```
4. Set up [Google Firebase Account](https://firebase.google.com) account and create `firebase.json` in root of the project
5. In your Firebase console, set the Firebase Authorised Domains and enable Google and Facebook social logins.
6. Create a Facebook social login app and set the credentials in your Firebase console.
7. Set up [Sendgrid](https://sendgrid.com) account
8. Set up [Stripe](https://stripe.com) account, [activate it](https://dashboard.stripe.com/account/onboarding), and then create [Connected accounts](https://dashboard.stripe.com/connect/accounts/overview)
9. Adjust `backend/quadraticfunding/productiondata.json` as desired
10. Place `fullchain.pem` and `privkey.pem` SSL certificates in the `certs` folder. For initial setup we recommend using [Certbot](https://certbot.eff.org/):
```
sudo certbot certonly --standalone --preferred-challenges http -d <yourdomain> -d <api.yourdomain> -d <www.yourdomain> --expand
```
11. Adjust the `nginx` and `docker-compose-prod.yml` files to indicate the right path to the certificates, as well as your domain name
12. Place custom SSL DH parameteres in `dh-param/dhparam-2048.pem`
13. Rename `.env.test` to `.env` and set all variables with your preferred values
14. Rename `.env.test.public` to `.env.prod.public` and set all variables with your preferred values.
15. Build images and start containers:
```
docker-compose -f docker-compose-prod.yml up --build
```

## How to add projects

1. Go to `<backend_url>/add_business_csv/<token>`, whereby `<token>` is the `ADD_BUSINESS_CSV_TOKEN` set in `.env`
2. Upload a CSV file with business data, see `backend/quadraticfunding/samplecompany.csv` for an example
