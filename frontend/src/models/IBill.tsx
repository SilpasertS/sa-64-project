import { CashiersInterface } from "./ICashier";

export interface BillsInterface {
    ID: number,
    PatientRightID: number,
    ExaminationID: number,
    Total: number,
    CashierID: number, 
    Cashier: CashiersInterface,
  }