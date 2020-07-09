import { IBusiness } from "../models/Business";
import { IDonation } from "../models/Donations";
import { IRound } from "../models/Round";

export const mapToBusinesses = (businesses: IBusiness[]): IBusiness[] => {
  return businesses.map(mapToBusiness);
};

export const mapToBusiness = (business: IBusiness): IBusiness => {
  return {
    id: business.id,
    name: business.name,
    owner_email: business.owner_email,
    logo: business.logo,
    short_description: business.short_description,
    history: business.history,
    covid_story: business.covid_story,
    other_content: business.other_content,
    expenditure_details: business.expenditure_details,
    stripe_id: business.stripe_id,
    goal_amount: business.goal_amount,
    donation_received: business.donation_received,
    current_clr_matching_amount: business.current_clr_matching_amount,
    cover_image: business.cover_image,
    main_business_image: business.main_business_image,
    staff_images: business.staff_images,
    business_video_link: business.business_video_link,
    website_link: business.website_link,
    facebook_profile_link: business.facebook_profile_link,
    instagram_profile_link: business.instagram_profile_link,
    saturation: business.saturation,
    accepting_donations: business.accepting_donations,
  };
};

export const mapToDonations = (donations: IDonation[]): IDonation[] => {
  return donations.map(mapToDonation);
};

export const mapToDonation = (donation: IDonation): IDonation => {
  return {
    id: donation.id,
    amount: donation.amount,
    donation_time: donation.donation_time,
    transaction_id: donation.transaction_id,
    donor: donation.donor,
    recipient: donation.recipient,
  };
};

export const mapToRound = (round: IRound): IRound => {
  return {
    round_number: round.round_number,
    round_status: round.round_status,
  };
};

export const transformToUserForServer = (user: any) => {
  return {
    password: user.password,
    last_login: user.last_login,
    is_superuser: user.is_superuser,
    username: user.email,
    first_name: user.displayName.split(" ")[0],
    last_name: user.displayName.split(" ")[1],
    email: user.email,
    is_staff: user.is_staff,
    is_active: user.is_active,
    date_joined: user.date_joined,
    profile_pic: user.photoURL,
    phone_number: user.phoneNumber,
    oauth_uuid: user.uid,
    groups: user.groups,
    user_permissions: user.user_permissions,
  };
};

export const toUrlEncoded = (obj) =>
  Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join("&");

export const containsSpecialCharacters = (str: string) => {
  // eslint-disable-next-line
  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return format.test(str);
};
export const containsLowerCase = (str: string) => {
  // eslint-disable-next-line
  return /[a-z]/.test(str);
};

export const containsUpperCase = (str: string) => {
  // eslint-disable-next-line
  return /[A-Z]/.test(str);
};

export const containsNumber = (str: string) => {
  // eslint-disable-next-line
  return /\d/.test(str);
};

export const validateEmail = (email: string) => {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validatePasswordLength = (password: string) => {
  if (password.length >= 8) {
    return true;
  }
  return false;
};
