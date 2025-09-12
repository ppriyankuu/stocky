import { Request, Response } from "express";
import { RewardService } from "../services/rewardService";


export async function createReward(req: Request, res: Response) {
    try {
        const { userId, stockSymbol, quantity, eventId } = req.body;

        await RewardService.createReward({
            userId,
            stockSymbol,
            quantity,
            eventId
        });

        res.status(200).json({
            success: true,
            message: 'reward created successfully'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};