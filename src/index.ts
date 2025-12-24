import express, { Request, Response, NextFunction } from "express";
import { paymentMiddleware } from "./paymentMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 🛡️ Conditional Wrapper Function
const x402Guard = (req: Request, res: Response, next: NextFunction) => {
  // Toggle this in your Railway Variables tab
  const isEnabled = process.env.ACTIVATE_X402 === "true";

  if (!isEnabled) {
    console.log("[x402] Mode: 🆓 FREE. Passing request...");
    return next();
  }

  console.log("[x402] Mode: 💰 PAID. Initiating handshake...");
  
  // Your registered Merchant Config
  const config = {
    merchantId: "de44364a-760e-40d9-8738-183de877b5b9",
    gatewayUrl: "https://cronos-x-402-production.up.railway.app",
    facilitatorUrl: "https://cronos-x-402-production.up.railway.app",
    network: "cronos-testnet" as const
  };

  // Execute the real middleware
  return paymentMiddleware(config)(req, res, next);
};

// Apply to your API routes
app.use("/api", x402Guard);

// ---------------------------------------------------------
// ✅ The Endpoint (Free now, Paid later)
// ---------------------------------------------------------
app.get("/api/greet", (req: Request, res: Response) => {
  res.json({
    message: "Hello",
    access: process.env.ACTIVATE_X402 === "true" ? "Verified Payment" : "Public Access",
    receipt: (req as any).payment || null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server active on port ${PORT}`);
});