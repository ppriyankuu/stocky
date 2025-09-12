import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../utils/prismaSingleton";
import { HistoricalValue, PortfolioHolding, RewardRequest, StockReward, UserStats } from "../types";
import { StockPriceService } from "./stockPriceService";
import { LedgerService } from "./ledgerService";
import { Stock } from "@prisma/client";

export class RewardService {
    static async createReward(rewardData: RewardRequest) {
        try {
            const existingReward = await prisma.rewardEvent.findUnique({
                where: {
                    eventId: rewardData.eventId
                }
            });

            if (existingReward)
                throw new Error('duplicate reward event')

            let stock = await prisma.stock.findUnique({
                where: { symbol: rewardData.stockSymbol }
            });

            if (!stock) {
                stock = await prisma.stock.create({
                    data: {
                        symbol: rewardData.stockSymbol,
                        name: rewardData.stockSymbol // in production, would be fetched from API
                    }
                });
            }

            // current stock price
            const currentPrice = await StockPriceService.fetchCurrentPrice(rewardData.stockSymbol);
            const quantity = new Decimal(rewardData.quantity);

            // creating a reward event and ledger entries
            await prisma.$transaction(async (tx) => {
                await tx.rewardEvent.create({
                    data: {
                        userId: rewardData.userId,
                        stockId: stock.id,
                        quantity,
                        eventId: rewardData.eventId
                    }
                });

                await LedgerService.recordStockPurchase(
                    rewardData.userId,
                    stock.id,
                    quantity,
                    currentPrice
                );
            });
        } catch (error: any) {
            console.error('Error creating reward:', error.message);
            throw error;
        }
    }

    static async getTodaysRewards(userId: string): Promise<StockReward[]> {
        const startOfTheDay = new Date();
        startOfTheDay.setHours(0, 0, 0, 0);

        const endOfTheDay = new Date();
        endOfTheDay.setHours(23, 59, 59, 999);

        const rewards = await prisma.rewardEvent.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startOfTheDay,
                    lte: endOfTheDay
                }
            },
            include: {
                stock: true
            },
            orderBy: { timestamp: 'desc' }
        });

        return rewards.map(reward => ({
            id: reward.id,
            stockSymbol: reward.stock.symbol,
            stockName: reward.stock.name,
            quantity: reward.quantity,
            timestamp: reward.timestamp
        }))
    }

    static async getHistorialINRValue(userId: string): Promise<HistoricalValue[]> {
        // all the reward events for the user (exluding today's)
        const yesterday = new Date();
        yesterday.setHours(0, 0, 0, 0);

        const rewards = await prisma.rewardEvent.findMany({
            where: {
                userId,
                timestamp: { lt: yesterday }
            },
            include: { stock: true },
            orderBy: { timestamp: 'asc' }
        })

        // total values arranged according to dates
        const dailyValues = new Map<String, Decimal>();

        for (const reward of rewards) {
            const date = reward.timestamp.toISOString().split('T')[0];
            const price = await StockPriceService.fetchCurrentPrice(reward.stock.symbol);
            const value = reward.quantity.mul(price);

            const existing = dailyValues.get(date) || new Decimal(0);
            dailyValues.set(date, existing.add(value));
        }

        return Array.from(dailyValues.entries()).map(([date, totalValue]) => ({
            date,
            totalValue
        }))
    }

    static async getUserStats(userId: string): Promise<UserStats> {
        // today's rewards grouped by stock
        const todaysRewards = await this.getTodaysRewards(userId);
        const stockSummary = new Map<String, Decimal>();

        for (const reward of todaysRewards) {
            const existing = stockSummary.get(reward.stockSymbol) || new Decimal(0);
            stockSummary.set(reward.stockSymbol, existing.add(reward.quantity));
        }

        // current portfolio value
        const allRewards = await prisma.rewardEvent.findMany({
            where: { userId },
            include: { stock: true }
        });

        let totalPorfolioValue = new Decimal(0);
        for (const reward of allRewards) {
            const price = await StockPriceService.fetchCurrentPrice(reward.stock.symbol);
            const value = reward.quantity.mul(price);
            totalPorfolioValue = totalPorfolioValue.add(value);
        }

        return {
            totalSharesToday: Array.from(stockSummary.entries()).map(([symbol, quantity]) => ({
                stockSymbol: String(symbol),
                totalQuantity: quantity
            })),
            currentPortfolioValue: totalPorfolioValue
        }
    }

    static async getPortfolio(userId: string): Promise<PortfolioHolding[]> {
        const rewards = await prisma.rewardEvent.findMany({
            where: { userId },
            include: { stock: true }
        });

        const holdings = new Map<String, { quantity: Decimal; stock: Stock }>();

        for (const reward of rewards) {
            const existing = holdings.get(reward.stock.symbol);
            if (existing) {
                existing.quantity = existing.quantity.add(reward.quantity);
            } else {
                holdings.set(reward.stock.symbol, {
                    quantity: reward.quantity,
                    stock: reward.stock
                })
            }
        }

        const portfolio: PortfolioHolding[] = [];
        for (const [symbol, holding] of holdings.entries()) {
            const currentPrice = await StockPriceService.fetchCurrentPrice(String(symbol));
            const currentValue = holding.quantity.mul(currentPrice);

            portfolio.push({
                stockSymbol: String(symbol),
                stockName: holding.stock.name,
                totalQuantity: holding.quantity,
                currentPrice,
                currentValue
            })
        }
        return portfolio;
    }
}

// gamingxyz