import { Contract } from "@/models/Contract";
import React from "react";

interface ContractData {
  data: Contract;
}
export const TransactionTable = (contract: ContractData) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Transaction History</h3>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {contract.data.transactions?.map((txn) => (
              <tr key={txn.transactionId} className="border-b">
                <td className="p-3">{txn.amount.toLocaleString()} VND</td>
                <td className="p-3">{txn.paymentDate.split("T")[0]}</td>
                <td className="p-3">{txn.methodName}</td>
                <td className="p-3 font-semibold">
                  {txn.status === "PAID" ? (
                    <span className="text-green-500">✅ PAID</span>
                  ) : txn.status === "PENDING" ? (
                    <span className="text-yellow-500">⏳ PENDING</span>
                  ) : (
                    <span className="text-red-500">❌ FAILED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
