import { AgentClient, AgentError } from "@cronos-merchant/sdk";
import 'dotenv/config'; // Recommended to keep your key in a .env file

// 1. Initialize the Agent
const agent = new AgentClient({
  privateKey: process.env.AGENT_KEY,       // Your wallet's private key
  rpcUrl: "https://evm-t3.cronos.org",    // Cronos Testnet RPC
  chainId: 338,                           // Cronos Testnet ID
  usdcAddress: "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0", // Testnet USDC (Example)
  dailyLimit: 10.0,                        // Safety cap
  trustedFacilitators: ["https://cronos-x-402-production.up.railway.app"]
});

async function getMonetizedData() {
  try {
    console.log("🚀 Requesting monetized API...");

    // 2. The SDK handles the 402 error and payment automatically
    const posts = await agent.fetch("http://localhost:3001/api/posts", {
      method: "GET"
    });

    console.log("✅ Success! Received Data:", posts.slice(0, 2)); // Show first 2 posts
  } catch (err) {
    if (err instanceof AgentError) {
      console.error(`❌ API Error [${err.status}]: ${err.code}`);
      console.error("Details:", err.details);
    } else {
      console.error("❌ Unexpected Error:", err);
    }
  }
}

getMonetizedData();