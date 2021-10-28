import { CashiersInterface } from "./ICashier";
import { BillsInterface } from "./IBill";
import { MethodsInterface } from "./IMethod";

export interface ReceiptInterface {
  ID: number,
  SavedTime: Date,
  CashierID: number,
  Cashier: CashiersInterface,
  BillID: number,
  Bill: BillsInterface,
  MethodID: number,
  Method: MethodsInterface,
}