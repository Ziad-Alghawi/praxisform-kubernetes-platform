export type SubmissionStatus = 'NEW' | 'VIEWED' | 'DONE';

export interface SubmissionListItem {
  id: string;               // gemappt von _id
  createdAt: string;        // ISO
  status: SubmissionStatus;
  formVersion: string;
  patientData?: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    phone?: string;
    email?: string;
    address?: Address;
  };
}
export interface Address {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
}
export interface SubmissionDetails extends SubmissionListItem {
  medical?: {
    allergies?: string[];
    medications?: string[];
    preExistingConditions?: string[];
    symptoms?: SymptomDetail[];
  };
  consents?: {
    gdprAccepted: boolean;
    dataSharingAccepted: boolean;
    acceptedAt?: string | null; // ISO
  };
  signature?: string | null;
  meta?: {
    tabletId?: string;
    language?: string;
    userAgent?: string;
    ip?: string;
  };
}

export interface SymptomDetail {
  key: string;
  label: string;
  option?: string | null;
  severity?: number | null;
  onset?: string | null;
  notes?: string | null;
}
