import express, { Request, Response, NextFunction } from "express";
import { paymentMiddleware } from "./paymentMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 🛡️ x402 Toggle Logic
const isX402Enabled = process.env.ACTIVATE_X402 === "true";

// Helper to wrap the middleware so it can be skipped if disabled
const conditionalPaymentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!isX402Enabled) {
    console.log(`[x402] Paywall skipped: API is currently FREE.`);
    return next();
  }

  const x402Config = {
    merchantId: process.env.MERCHANT_ID || "",
    gatewayUrl: process.env.GATEWAY_URL || "https://cronos-x-402-production.up.railway.app",
    facilitatorUrl: process.env.FACILITATOR_URL || "https://cronos-x-402-production.up.railway.app",
    network: (process.env.NETWORK as "cronos-testnet" | "cronos-mainnet") || "cronos-testnet",
  };

  // Run the actual x402 logic
  return paymentMiddleware(x402Config)(req, res, next);
};

// 1️⃣ Apply the conditional middleware to your API routes
app.use("/api", conditionalPaymentMiddleware);

// ---------------------------------------------------------
// ✅ The Endpoint (Free now, Paid later)
// ---------------------------------------------------------
app.get("/api/greet", (req: Request, res: Response) => {
  res.json({
    message: "Hello",
    status: isX402Enabled ? "PAID_ACCESS" : "FREE_ACCESS",
    receipt: (req as any).payment || null
  });
});

// Health check (Public)
app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Mode: ${isX402Enabled ? "💰 PAID" : "🆓 FREE"}`);
});