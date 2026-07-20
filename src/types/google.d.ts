// src/types/google.d.ts
// Minimal ambient declarations for Google Identity Services (loaded at runtime
// from https://accounts.google.com/gsi/client).

interface CredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleIdConfiguration {
  client_id?: string;
  callback?: (response: CredentialResponse) => void;
  nonce?: string;
  use_fedcm_for_prompt?: boolean;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  prompt: () => void;
  cancel: () => void;
}

declare const google: {
  accounts: {
    id: GoogleAccountsId;
  };
};
