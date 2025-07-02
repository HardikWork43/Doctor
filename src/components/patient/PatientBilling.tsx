import React from 'react';
import { FaCreditCard, FaFileInvoice } from 'react-icons/fa';

type Bill = {
  id: string;
  appointmentDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  service: string;
};

type PatientBillingProps = {
  bills: Bill[];
};

const PatientBilling: React.FC<PatientBillingProps> = ({ bills }) => {
  const totalPending = bills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalPaid = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Billing & Payments</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <FaCreditCard className="text-green-600 text-2xl mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-green-800">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-center">
            <FaFileInvoice className="text-yellow-600 text-2xl mr-3" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Outstanding Balance</p>
              <p className="text-2xl font-bold text-yellow-800">${totalPending.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center">
            <FaFileInvoice className="text-blue-600 text-2xl mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Bills</p>
              <p className="text-2xl font-bold text-blue-800">{bills.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(bill.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${bill.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                      bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {bill.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-900 font-medium transition-colors">
                          Pay Now
                        </button>
                      )}
                      {bill.status === 'overdue' && (
                        <button className="text-red-600 hover:text-red-900 font-medium transition-colors">
                          Pay Now
                        </button>
                      )}
                      {bill.status === 'paid' && (
                        <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                          View Receipt
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {bills.length === 0 && (
          <div className="text-center py-12">
            <FaFileInvoice className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills available</h3>
            <p className="text-gray-500">
              Your billing information will appear here after your appointments.
            </p>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      {bills.some(bill => bill.status === 'pending' || bill.status === 'overdue') && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">Payment Information</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• We accept all major credit cards, debit cards, and bank transfers</p>
            <p>• Payment plans are available for treatments over $500</p>
            <p>• Insurance claims are processed automatically when applicable</p>
            <p>• For payment assistance, please contact our billing department at (555) 123-4567</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBilling;