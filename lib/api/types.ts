export type LoanProspectPayload = {
  full_name: string;
  ind_id_no: string;
  ind_birthdate: string; // YYYY-MM-DD
  ind_main_mobileph: string;
  bp_addr: string;
  ind_occupt_onid: string;
  ind_lama_kerja: number;
  ind_salary: number;
  loanprd_shortname: string;
  lord_loan_amt: number;
  lord_jml_angs: number;
};

export type LoanProspectResponse = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  ttlRecords?: number;
  ttlPages?: number;
  pageNo?: number;
  pageRecords?: number;
  data?: {
    prpect_uuid: string;
    prpect_channel_id?: number;
    prpect_status?: string;
    prpect_bp_type?: string;
    prpect_bp_fullname?: string;
    [key: string]: unknown;
  };
};

export type LoanProspectError = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  responseCode?: string;
  responseMessage?: string;
};

