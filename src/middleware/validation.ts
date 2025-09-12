import { NextFunction, Request, Response } from "express";

export const validateRewardRequest = (req: Request, res: Response, next: NextFunction) => {
    const { userId, stockSymbol, quantity, eventId } = req.body;

    if (!userId || !stockSymbol || !quantity || !eventId) {
        res.status(400).json({
            success: false,
            error: 'missing required fieds: userId, stockSymbol, quantity, evenId'
        });
        return;
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
            success: false,
            error: 'Quantity must be a positive number'
        });
        return;
    }
    next();
}