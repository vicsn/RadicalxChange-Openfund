let selectedBusinessStripeAccountId = "";

export const getSelectedBusinessStripeAccountId = (): string => {
  return selectedBusinessStripeAccountId;
};

export const setSelectedBusinessStripeAccountId = (
  pSelectedBusinessStripeAccountId: string,
) => {
  selectedBusinessStripeAccountId = pSelectedBusinessStripeAccountId;
};

export const TEST_SITE_KEY = "6Lf8Lq8ZAAAAAMcvLBPMfV-AFImJM12-JJluZskI";
