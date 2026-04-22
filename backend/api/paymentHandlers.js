const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const envFilePath = path.join(__dirname, ".env");

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

function normalizeCredential(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

function getRuntimeEnv() {
  return String(
    process.env.RAZORPAY_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV || ""
  )
    .trim()
    .toLowerCase();
}

function getRequestHost(req) {
  return String(
    req?.headers?.["x-forwarded-host"] || req?.headers?.host || ""
  )
    .trim()
    .toLowerCase();
}

function isVercelPreviewHost(hostname) {
  return Boolean(hostname) && hostname.endsWith(".vercel.app");
}

function getCredentialSet() {
  const liveKeyId = normalizeCredential(process.env.RAZORPAY_KEY_ID);
  const liveKeySecret = normalizeCredential(process.env.RAZORPAY_KEY_SECRET);
  const testKeyId = normalizeCredential(process.env.RAZORPAY_TEST_KEY_ID);
  const testKeySecret = normalizeCredential(process.env.RAZORPAY_TEST_KEY_SECRET);
  const runtimeEnv = getRuntimeEnv();
  const hasLiveCredentials = Boolean(liveKeyId && liveKeySecret);
  const hasTestCredentials = Boolean(testKeyId && testKeySecret);
  const shouldPreferTest =
    runtimeEnv === "preview" || runtimeEnv === "development" || runtimeEnv === "test";
  const shouldPreferLive = runtimeEnv === "production";

  if (runtimeEnv === "live") {
    if (!hasLiveCredentials) {
      throw new Error(
        "RAZORPAY_ENV=live is set, but live Razorpay credentials are missing."
      );
    }

    return {
      keyId: liveKeyId,
      keySecret: liveKeySecret,
      mode: "live",
    };
  }

  if (runtimeEnv === "test") {
    if (!hasTestCredentials) {
      throw new Error(
        "RAZORPAY_ENV=test is set, but test Razorpay credentials are missing."
      );
    }

    return {
      keyId: testKeyId,
      keySecret: testKeySecret,
      mode: "test",
    };
  }

  if (shouldPreferTest) {
    if (hasTestCredentials) {
      return {
        keyId: testKeyId,
        keySecret: testKeySecret,
        mode: "test",
      };
    }

    if (hasLiveCredentials) {
      throw new Error(
        "Preview/development deployments should use RAZORPAY_TEST_KEY_ID and RAZORPAY_TEST_KEY_SECRET. If you intentionally want live payments here, set RAZORPAY_ENV=live."
      );
    }
  }

  if (shouldPreferLive) {
    if (hasLiveCredentials) {
      return {
        keyId: liveKeyId,
        keySecret: liveKeySecret,
        mode: "live",
      };
    }

    if (hasTestCredentials) {
      throw new Error(
        "Production deployments should use RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET. If you intentionally want test payments here, set RAZORPAY_ENV=test."
      );
    }
  }

  if (hasLiveCredentials) {
    return {
      keyId: liveKeyId,
      keySecret: liveKeySecret,
      mode: "live",
    };
  }

  if (hasTestCredentials) {
    return {
      keyId: testKeyId,
      keySecret: testKeySecret,
      mode: "test",
    };
  }

  throw new Error(
    "Missing Razorpay credentials. Set live keys for production and test keys for preview/development."
  );
}

async function createOrderHandler(req, res) {
  try {
    const { amount } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const credentialSet = getCredentialSet();
    const requestHost = getRequestHost(req);

    // Live mode on disposable preview URLs often fails inside Checkout with a vague 401.
    // We fail early here so the UI can show a clear fix instead.
    if (
      credentialSet.mode === "live" &&
      isVercelPreviewHost(requestHost) &&
      String(process.env.ALLOW_LIVE_ON_VERCEL_PREVIEW || "").trim().toLowerCase() !==
        "true"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Live Razorpay payments are blocked on Vercel preview URLs. Use test Razorpay keys for preview deployments, or open the production domain registered in Razorpay. If this is intentional, set ALLOW_LIVE_ON_VERCEL_PREVIEW=true.",
      });
    }

    const razorpay = new Razorpay({
      key_id: credentialSet.keyId,
      key_secret: credentialSet.keySecret,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      keyId: credentialSet.keyId,
      mode: credentialSet.mode,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Failed to create Razorpay order",
    });
  }
}

async function paymentSuccessHandler(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      total,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const { keySecret } = getCredentialSet();
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log("Payment verified successfully");
    console.log({
      razorpay_order_id,
      razorpay_payment_id,
      customer,
      items,
      total,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order saved successfully",
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify payment",
    });
  }
}

module.exports = {
  createOrderHandler,
  paymentSuccessHandler,
};
