import { prisma } from "../utils/prismaSingleton";
import { Decimal } from "@prisma/client/runtime/library";
import { EntryType } from "@prisma/client";

export class LedgerService {
    static async recordStockPurchase(
        userId: string,
        stockId: string,
        quantity: Decimal,
        pricePerShare: Decimal
    ) {
        const totalAmount = quantity.mul(pricePerShare);
        const brokerage = totalAmount.mul(0.0001); // 0.03% brokerage fee
        const stt = totalAmount.mul(0.001); // 0.1% STT
        const gst = brokerage.mul(0.18); // 18% GST on brokerage

        await prisma.$transaction([
            // purchase entry of the stock
            prisma.ledgerEntry.create({
                data: {
                    userId,
                    stockId,
                    entryType: EntryType.STOCK_PURCHASE,
                    amount: totalAmount,
                    description: `Stock purchase: ${quantity} shares`
                }
            }),

            // brokerage fee entry
            prisma.ledgerEntry.create({
                data: {
                    userId,
                    stockId,
                    entryType: EntryType.BROKERAGE_FEE,
                    amount: brokerage,
                    description: 'brokerage fee'
                }
            }),

            // STT entry
            prisma.ledgerEntry.create({
                data: {
                    userId,
                    stockId,
                    entryType: EntryType.STT_TAX,
                    amount: stt,
                    description: 'Securities Transaction Tax'
                }
            }),

            // GST entry
            prisma.ledgerEntry.create({
                data: {
                    userId,
                    stockId,
                    entryType: EntryType.GST_TAX,
                    amount: gst,
                    description: 'Goods and Service Tax'
                }
            }),
        ]);
    }
}