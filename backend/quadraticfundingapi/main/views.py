import json
import csv
import io
import logging
import os

import stripe

from django.http import HttpResponse
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, mixins, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException

from .permissions import UserPermission, BusinessPermission, DonationPermission
from .utils import account_activation_token
from .clr import calculate_clr_match
from .serializers import UserSerializer, BusinessSerializer, DonationSerializer, CLRManySerializer, LoginTokenSerializer, RoundSerializer, StripeSecretKey
from .models import User, Business, Donation, CLRRound

STRIPE_KEY = os.environ.get('STRIPE_KEY')
STRIPE_WEBHOOK_KEY = os.environ.get('STRIPE_WEBHOOK_KEY')
CURRENT_ROUND = os.environ.get('CURRENT_ROUND', 1)

stripe.api_key = STRIPE_KEY
logger = logging.getLogger(__name__)

# Create your views here.
class RootView(APIView):
    def get(self, request):
        resp = {
            'title': 'Quadratic Funding API'
        }
        return Response(json.dumps(resp), status=status.HTTP_201_CREATED)


class UserList(mixins.CreateModelMixin,
               generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = (UserPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        if request.user.is_staff:
            users = self.queryset
            serializer = self.serializer_class(users)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            msg = {
                "detail": "You do not have permission to perform this action."
            }
            logger.error('User is not authenticated to perform this request' + request.user.email)
            return Response(msg, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UserListDetail(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = (UserPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class BusinessList(mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   generics.GenericAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

    permission_classes = (BusinessPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class BusinessListDetail(mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         generics.GenericAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

    permission_classes = (BusinessPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class DonationList(generics.GenericAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

    permission_classes = (DonationPermission, )
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        user_donations = Donation.objects.filter(donor=request.user)
        donation_serializer = DonationSerializer(user_donations, many=True)
        return Response(donation_serializer.data, status=status.HTTP_201_CREATED)


class StripeDonations(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        payload = request.body
        signature = request.headers.get("Stripe-Signature")
        serializer_class = DonationSerializer

        try:
            event = stripe.Webhook.construct_event(
                payload=payload, sig_header=signature, secret=STRIPE_WEBHOOK_KEY
            )
        except ValueError as e:
            # Invalid payload.
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid Signature.
            print(e, signature, STRIPE_WEBHOOK_KEY, payload)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        # return self.create(request, *args, **kwargs)
        logger.info(f'Event Type is {event["type"]}')
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            # connected_account_id = event["account"]
            connected_account_id = event['data']['object']['charges']['data'][0]['receipt_url'].split('/')[4]

            transaction_id = payment_intent['id']
            donation_amount = int(payment_intent['amount']) / 100
            user_email = payment_intent['charges']['data'][0]['billing_details']['email']

            logger.info(
                f'Payment Received {transaction_id} for Business with Stripe ID - {connected_account_id}, For Amount - {donation_amount} by User - {user_email}')

            try:
                user = User.objects.get(email=user_email)
            except ObjectDoesNotExist as e:
                logger.exception(e)
                logger.error(f'No User Found for The Donation {transaction_id} by User Email - {transaction_id}')
                return Response(json.dumps({"success": False}), status=status.HTTP_406_NOT_ACCEPTABLE)

            try:
                business = Business.objects.get(stripe_id=connected_account_id)
            except ObjectDoesNotExist as e:
                logger.exception(e)
                logger.error(
                    f'No Matching Business Found for The Donation {transaction_id} by User Email - {user_email}')
                return Response(json.dumps({"success": False}), status=status.HTTP_406_NOT_ACCEPTABLE)

            if user and business:

                clr_match_amount, business_total_matched_clr_amount, business_totals = calculate_clr_match(
                    user.id, business.id, donation_amount)

                logger.info(
                    f'CLR Amount Matched for {transaction_id}, Donation Amount {donation_amount}, Matched Amount {clr_match_amount}, Business Total Matched Amount {business_total_matched_clr_amount} by User Email {user_email}')

                round = CLRRound.objects.get(round_number=CURRENT_ROUND)

                donation_obj = Donation(
                    round_number=round,
                    donation_amount=donation_amount,
                    matched_amount=clr_match_amount,
                    donor=user,
                    recipient=business,
                    transaction_id=transaction_id,
                    match=True,
                    donation_status="Success"
                )

                donation_obj.save()

                if clr_match_amount == 0:
                    business.cap_reached = True

                # business.current_clr_matching_amount = business_total_matched_clr_amount
                business_current_donation = business.donation_received
                business_new_donation = business_current_donation + donation_amount
                business.donation_received = business_new_donation

                business.save()

                for t in business_totals:
                    bid = t['id']
                    b = Business.objects.get(pk=int(bid))
                    if t['clr_amount'] > 0:
                        b.current_clr_matching_amount = t['clr_amount']
                        b.save()

        return Response(json.dumps({"success": True}), status=status.HTTP_201_CREATED)


class DonationListDetail(mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         generics.GenericAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

    permission_classes = (DonationPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class CLRCalculation(generics.GenericAPIView):
    serializer_class = CLRManySerializer

    def post(self, request):
        serialized_data = CLRManySerializer(data=request.data)
        if serialized_data.is_valid(raise_exception=True):
            clr_objs = serialized_data.validated_data.get('clr_objs')
            clr_matches = []
            for obj in clr_objs:
                user_id = obj.get('user_id')
                business_id = obj.get('business_id')
                donation_amount = obj.get('donation_amount')
                try:
                    user_match_amount, business_matched_clr_amount, business_totals = calculate_clr_match(
                        user_id, business_id, donation_amount)
                    logger.debug(user_match_amount, business_matched_clr_amount)
                    clr_matches.append(user_match_amount)
                except ObjectDoesNotExist as e:
                    logger.exception('Exception in Finding User or Business, ' + str(e))

            return Response(json.dumps({'clr_data': clr_matches}), status=status.HTTP_201_CREATED)


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_email_verified = True
        user.is_active = True
        user.save()
        return HttpResponse('''
        Thank you for your email confirmation. Now you can login to your account. Go to :- <a href="https://downtownstimulus.com">https://downtownstimulus.com</a>
        <script>
            function redirect(){
               window.location.href = "https://downtownstimulus.com";
            }
        
            setTimeout(redirect, 3000);
        </script>
        ''')
    else:
        return HttpResponse('Activation link is invalid!')


class CustomAuthToken(ObtainAuthToken):
    serializer_class = LoginTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginTokenSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'id': user.pk,
                'email': user.email,
                'phone_number': user.phone_number,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_pic': user.profile_pic,
            })


def add_business_csv(request):
    if request.method == 'GET':
        return render(request, 'add_business_csv.html')
    if request.method == "POST":
        csv_file = request.FILES['file']
        data_set = csv_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)

        for count, row in enumerate(csv.reader(io_string, delimiter=',')):
            if count == 0 or count == 1:
                continue
            logger.info(row)
            business = Business(
                name=row[2],
                owner_email=row[1],
                short_description=row[3],
                history=row[7],
                covid_story=row[8],
                expenditure_details=row[9].strip().split(','),
                other_content=row[15],
                website_link=row[4],
                facebook_profile_link=row[5],
                instagram_profile_link=row[6],
                stripe_id="",
                logo=row[10],
                cover_image=row[11],
                main_business_image=row[11],
                staff_images=[row[12]],
            )
            business.save()

        return HttpResponse('Data Uploaded')


class CLRRoundView(generics.GenericAPIView):
    queryset = CLRRound.objects.all()
    serializer_class = RoundSerializer

    def get(self, request, *args, **kwargs):
        data = CLRRound.objects.get(round_number=CURRENT_ROUND)
        round_serializer = RoundSerializer(data)
        return Response(round_serializer.data, status=status.HTTP_201_CREATED)


class StripeSecretKeyView(generics.GenericAPIView):

    serializer_class = StripeSecretKey
    permission_classes = (IsAuthenticated,)
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = StripeSecretKey(data=request.data)
        print(request.META)
        if serializer.is_valid(raise_exception=True):
            try:
                # user = request.user
                # if not user.stripe_customer_id:
                #     customer = stripe.Customer.create(name=user.get_full_name(), email=user.email)
                #     user.stripe_customer_id = customer['id']
                business_id = serializer.validated_data.get('business_id')
                business = Business.objects.get(pk=int(business_id))
                resp = stripe.PaymentIntent.create(
                    amount=serializer.validated_data.get('amount'),
                    currency='usd',
                    payment_method_types=['card'],
                    description='RadicalxChange Openfund Donation',
                    stripe_account=business.stripe_id,
                    # customer=user.stripe_customer_id,
                    shipping={
                        'address': {
                            'line1': serializer.validated_data.get('shipping_address', ''),
                            'country': serializer.validated_data.get('shipping_country', 'US')
                        },
                        'name': serializer.validated_data.get('name'),
                    }
                )
                # user.save()
            except Exception as e:
                logger.exception('Cannot Create Stripe Client Secret Key ' + str(e))
                raise APIException('Cannot Create Stripe Client Secret Key')

            return Response(json.dumps({'secret_key': resp['client_secret']}), status=status.HTTP_201_CREATED)