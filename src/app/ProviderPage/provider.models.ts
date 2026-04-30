export interface ProviderManagerPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ProviderAddressPayload {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postal_code: string;
}

export interface CreateProviderPayload {
  name: string;
  DocumentNumber: string;
  manager: ProviderManagerPayload;
  address: ProviderAddressPayload;
}

export interface ProviderByUserIdResponse {
  id: string;
  name: string;
  documentNumber: string;
  providerStatus: string;
  created_at: string;
  updated_at: string;
}
