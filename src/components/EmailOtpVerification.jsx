import { useState } from "react";
import EmailOtpVerification from "./EmailOtpVerification";

export default function Checkout() {
  const [verifiedUser, setVerifiedUser] = useState(null);

  const handleVerified = (user) => {
    console.log("Verified User:", user);

    setVerifiedUser(user);

    // Save user for future use
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        ...user,
        expiryTime: Date.now() + 5 * 60 * 1000, // 5 minutes
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f4ea] px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {!verifiedUser ? (
          <>
            <h2 className="text-3xl font-bold text-[#b48a2c] text-center mb-8">
              Email Verification
            </h2>

            <EmailOtpVerification
              onVerified={handleVerified}
            />
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e7dcc3]">

              <h2 className="text-3xl font-bold text-[#2f4f2f] mb-4">
                Checkout
              </h2>

              <div className="mb-6">
                <p>
                  <strong>Name :</strong> {verifiedUser.name}
                </p>

                <p>
                  <strong>Email :</strong> {verifiedUser.email}
                </p>
              </div>

              {/* Your Billing Form */}

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="City"
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full border rounded-xl px-4 py-3"
                />

              </div>

              <button
                className="mt-8 w-full bg-[#2f4f2f] text-white py-4 rounded-xl hover:opacity-90 transition"
              >
                Place Order
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}