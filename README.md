# Stock Reward Service
This backend API is designed to manage a system where users are rewarded with shares of Indian stocks. It handles the recording of these rewards, manages user portfolios, and calculates their value in Indian Rupees (INR).

## Setup Instructions
1. **Build the project**: Compile the TypeScript source files into a runnable JavaScript application.
```
tsc
```
2. **Start the server**
```
node dist/app.js
```
The API will be available at `http://localhost:3000`.

## API Documentation
1. `POST /api/reward`
This endpoint logs a new stock reward for a user. The request payload includes the user's ID, the stock's symbol, the quantity of shares, and a unique event ID to prevent duplicate entries.

*Request body*:
```
{
  "userId": "user123",
  "stockSymbol": "RELIANCE",
  "quantity": 2.5,
  "eventId": "reward_12345"
}
```
*Expected response*:
```
{
  "success": true,
  "message": "reward created successfully"
}
```

2. `GET /api/today-stocks/{userId}`
Fetches all stock rewards a user received on the current day.

*Expected response*:
```
{
  "success": true,
  "data": [
    {
      "id": "reward123",
      "stockSymbol": "RELIANCE",
      "stockName": "RELIANCE",
      "quantity": "2.500000",
      "timestamp": "2025-09-12T10:30:00.000Z"
    }
  ]
}
```

3. `GET /api/historical-inr/{userId}`
Provides the daily total value of a user's stock rewards in INR for all past days.

*Expected Response*:
```
{
  "success": true,
  "data": [
    {
      "date": "2025-09-11",
      "totalValue": "6250.0000"
    }
  ]
}
```

4. `GET /api/stats/{userId}`
Returns key performance metrics for a user's portfolio, including the total shares rewarded today (grouped by stock) and the current total value of their entire portfolio in INR.

*Expected Response*:
```
{
  "success": true,
  "data": {
    "totalSharesToday": [
      {
        "stockSymbol": "RELIANCE",
        "totalQuantity": "2.500000"
      }
    ],
    "currentPortfolioValue": "12500.0000"
  }
}
```

5. `GET /api/portfolio/{userId}`
Displays the full holdings of a user's portfolio, listing each stock with its total quantity, current price, and total value.

*Expected Response*:
```
{
  "success": true,
  "data": [
    {
      "stockSymbol": "RELIANCE",
      "stockName": "RELIANCE",
      "totalQuantity": "5.000000",
      "currentPrice": "2500.0000",
      "currentValue": "12500.0000"
    }
  ]
}
```