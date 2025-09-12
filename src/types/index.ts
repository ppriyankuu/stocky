import { Decimal } from '@prisma/client/runtime/library'

export interface RewardRequest {
    userId: string;
    stockSymbol: string;
    quantity: number;
    eventId: string;
}

export interface StockReward {
    id: string;
    stockSymbol: string;
    stockName: string;
    quantity: Decimal;
    timestamp: Date;
}

export interface HistoricalValue {
    date: String;
    totalValue: Decimal;
}

export interface UserStats {
    totalSharesToday: StockSummary[];
    currentPortfolioValue: Decimal;
}

export interface StockSummary {
    stockSymbol: string;
    totalQuantity: Decimal;
    currentPrice?: Decimal;
    currentValue?: Decimal;
}

export interface PortfolioHolding {
    stockSymbol: string;
    stockName: string;
    totalQuantity: Decimal;
    currentPrice: Decimal;
    currentValue: Decimal;
}