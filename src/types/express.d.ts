import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            payment?: {
                txHash: string;
                payer: string;
                amount: string;
                currency: string;
            };
        }
    }
}