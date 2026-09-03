import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, activeInvoiceOrder } = useApp();

  if (!isInvoiceModalOpen || !activeInvoiceOrder) return null;

  const order = activeInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
        
        {/* Header toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Tax Invoice #{order.id}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 print:text-black text-xs">
          
          {/* Brand & Invoice Details */}
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent block">
                CraveWave Food Express
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                GSTIN: 29AAACW9482Q1Z4
              </span>
              <span className="text-[11px] text-slate-400 block">
                support@cravewave.com • 1800-CRAVE-WAVE
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-wider block text-slate-400">
                Invoice No.
              </span>
              <span className="font-mono font-bold text-sm block text-slate-900 dark:text-white">
                INV-{order.id}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{order.date}</span>
            </div>
          </div>

          {/* Customer & Restaurant Billed Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{order.deliveryAddress.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {order.deliveryAddress.flat}, {order.deliveryAddress.area}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Phone: {order.deliveryAddress.phone}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Restaurant Partner
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{order.restaurantName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {order.restaurantAddress}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                FSSAI Lic: 11223344005566
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Dish / Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 dark:text-white">{item.dish.name}</p>
                      {item.customizations && (
                        <p className="text-[10px] text-slate-400">
                          {item.customizations
                            .map((c) => c.selectedOptions.map((o) => o.name).join(', '))
                            .join(' • ')}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">₹{item.itemTotal}</td>
                    <td className="p-3 text-right font-bold font-mono">
                      ₹{item.itemTotal * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charges & Grand Total breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Item Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                ₹{order.subtotal}
              </span>
            </div>

            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Delivery Charges</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Platform Fee</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                ₹{order.platformFee}
              </span>
            </div>

            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>GST & Food Taxes</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                ₹{order.taxes}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Promotional Discount ({order.appliedCoupon?.code || 'OFFER'})</span>
                <span className="font-mono">-₹{order.discount}</span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>Grand Total Paid ({order.paymentMethod})</span>
              <span className="text-base text-orange-600 dark:text-orange-400 font-mono">
                ₹{order.total}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
            <p>This is a computer generated invoice and does not require a physical signature.</p>
            <p className="mt-0.5">Thank you for dining with CraveWave!</p>
          </div>

        </div>

      </div>
    </div>
  );
};
