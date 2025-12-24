import express from "express";
import { paymentMiddleware } from "./paymentMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 🛡️ x402 Middleware - Applied directly to all routes
app.use(paymentMiddleware({
  merchantId: "de44364a-760e-40d9-8738-183de877b5b9",
  gatewayUrl: "https://cronos-x-402-production.up.railway.app",
  facilitatorUrl: "https://cronos-x-402-production.up.railway.app",
  network: "cronos-testnet"
}));

// ✅ Your Greet Endpoint (Now protected by the middleware above)
app.get("/api/greet", (req, res) => {
  res.json({
    message: "Hello",
    receipt: (req as any).payment || null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server active on port ${PORT}`);
  console.log(`Protected endpoint: http://localhost:${PORT}/api/greet`);
});