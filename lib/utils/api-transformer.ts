import type { ApplicationDraft, Product } from "@/types/domain";
import type { LoanProspectPayload } from "@/lib/api/types";
import { mapProductNameToAPI } from "./product-mapper";

/**
 * Transform form data ke format API
 */
export function transformFormDataToAPI(
  draft: ApplicationDraft,
  product: Product,
  phoneNumber: string
): LoanProspectPayload {
  // Format phone number: remove non-numeric, ensure format
  const formattedPhone = phoneNumber.replace(/\D/g, "");
  
  // Ensure birthdate is in YYYY-MM-DD format
  const formattedBirthdate = draft.personal.birthdate || "";
  
  // Map product name to API format
  const productName = mapProductNameToAPI(product.name);
  
  return {
    full_name: draft.personal.fullName,
    ind_id_no: draft.screening.nik,
    ind_birthdate: formattedBirthdate,
    ind_main_mobileph: formattedPhone,
    bp_addr: draft.personal.address,
    ind_occupt_onid: draft.screening.occupation,
    ind_lama_kerja: draft.screening.workDuration,
    ind_salary: draft.screening.monthlyIncome,
    loanprd_shortname: productName,
    lord_loan_amt: draft.screening.loanAmount,
    lord_jml_angs: draft.screening.requestedTenor,
  };
}

