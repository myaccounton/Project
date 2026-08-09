import React from "react";

const PaymentModal = ({
  amount,
  title = "Payment",
  movieTitle,
  dailyRate,
  subtitle,
  onPay,
  onClose,
  disabled = false,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[1040] bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={disabled ? undefined : onClose}
      />

      <div
        className="fixed inset-0 z-[1050] flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-left align-middle shadow-2xl transition-all">
          <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-5 flex items-center justify-between">
            <h5 className="text-xl font-extrabold text-white flex items-center gap-2 m-0">
              <i className="fas fa-credit-card text-blue-500"></i>
              {title}
            </h5>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 border-none bg-transparent m-0 p-0"
              onClick={onClose}
              disabled={disabled}
              aria-label="Close"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="px-6 py-8">
            <div className="mb-8 text-center">
              {movieTitle && (
                <p className="text-xl font-bold text-white mb-2">{movieTitle}</p>
              )}
              {dailyRate != null && (
                <p className="text-sm font-medium text-gray-400">
                  Daily rate: Rs {Number(dailyRate).toFixed(0)}/day
                </p>
              )}
              {subtitle != null && subtitle !== "" && (
                <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>

            <div className="mb-8 rounded-xl border border-gray-800 bg-gray-800/40 p-6 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Amount due</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Rs {Number(amount).toFixed(2)}
              </p>
            </div>

            {disabled && (
              <div className="mb-6 flex items-center justify-center gap-3 text-blue-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="text-sm font-bold tracking-wide">Processing Payment...</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-500 hover:shadow-green-500/25 disabled:opacity-50 border-none outline-none"
                onClick={() => onPay("UPI")}
                disabled={disabled}
              >
                <i className="fas fa-mobile-alt text-lg"></i>
                Pay with UPI
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-blue-500/25 disabled:opacity-50 border-none outline-none"
                onClick={() => onPay("Card")}
                disabled={disabled}
              >
                <i className="fas fa-credit-card text-lg"></i>
                Pay with Card
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-4 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-700 disabled:opacity-50 outline-none"
                onClick={() => onPay("Cash")}
                disabled={disabled}
              >
                <i className="fas fa-money-bill-wave text-lg"></i>
                Pay with Cash
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
