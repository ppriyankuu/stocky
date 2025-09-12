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
