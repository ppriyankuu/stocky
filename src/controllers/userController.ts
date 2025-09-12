import { Request, Response } from "express";
import { RewardService } from "../services/rewardService";

export const getTodaysStocks = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const stocks = await RewardService.getTodaysRewards(userId);

        res.json({
            success: true,
            data: stocks
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getHistorialINR = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const historicalData = await RewardService.getHistorialINRValue(userId);

        res.json({
            success: true,
            data: historicalData
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const stats = await RewardService.getUserStats(userId);

        res.json({
            success: true,
            data: stats
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });

    }
}

export const getPortfolio = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const portfolio = await RewardService.getPortfolio(userId);

        res.json({
            success: true,
            data: portfolio
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });

    }
}