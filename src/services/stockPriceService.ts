import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prismaSingleton";

export class StockPriceService {
    // simulating stock prices fetch (in real app, this would call an external API)
    static async fetchCurrentPrice(stockSymbol: string) {
        try {
            const recentPrice = await prisma.stockPrice.findFirst({
                where: {
                    stock: { symbol: stockSymbol },
                    timestamp: {
                        gte: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
                    }
                },
                orderBy: { timestamp: 'desc' }
            });

            if (recentPrice) {
                return recentPrice.price;
            }

            // generating mock price
            const mockPrice = this.generateMockPrice(stockSymbol);

            const stock = await prisma.stock.findUnique({
                where: { symbol: stockSymbol }
            });

            if (stock) {
                await prisma.stockPrice.create({
                    data: {
                        stockId: stock.id,
                        price: mockPrice
                    }
                });
            }

            return mockPrice;
        } catch (error: any) {
            console.error('error fetching stock price:', error.message);
            throw new Error('Failed to fetch stock price');
        }
    }

    private static generateMockPrice(stockSymbol: string): Decimal {
        const basePrices: { [key: string]: number } = {
            'RELIANCE': 2500,
            'TCS': 3800,
            'INFOSYS': 1650,
            'HDFC': 1580,
            'ITC': 450
        };

        const basePrice = basePrices[stockSymbol] || 1000;
        const variation = (Math.random() - 0.5) * 0.1; // +-5% variation
        const finalprice = basePrice * (1 + variation);

        return new Decimal(finalprice.toFixed(2));
    }

    static async updateAllStockPrices() {
        try {
            const stocks = await prisma.stock.findMany({});

            for (const stock of stocks) {
                await this.fetchCurrentPrice(stock.symbol);
            }
        } catch (error: any) {
            console.error('error updating stock prices:', error.message);
        }
    }
}

