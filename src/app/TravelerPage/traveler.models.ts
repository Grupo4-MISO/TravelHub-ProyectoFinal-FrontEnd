export interface TravelerPayload {
  documentNumber: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  travelerStatus: string;
  gender: string;
  photo?: string;
}

export interface TravelerAddressPayload {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postal_code: string;
}

export interface CreateTravelerPayload {
  traveler: TravelerPayload;
  address: TravelerAddressPayload;
}

export interface TravelerByUserIdResponse {
  id: string;
  documentNumber: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  travelerStatus: string;   
}
