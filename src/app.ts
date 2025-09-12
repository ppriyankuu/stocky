import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((error: Error,
    req: Request,
    res: Response,
    next: NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

// hourly fetching of the latest stock prices
// shouldn't use this for production. 
// high risk of duplicate execution if multiple instances are ran
// better to use a cron job or something similar
import * as schedule from 'node-schedule';
import { StockPriceService } from './services/stockPriceService';

schedule.scheduleJob('0 * * * *', async () => {
    console.log('updating stock prices...')
    await StockPriceService.updateAllStockPrices();
})