# how to run

1. 
```
tsc
node dist/app.js
```

2. POST req `http://locahost:3000/api/reward`
```
{
  "userId": "user123",
  "stockSymbol": "RELIANCE",
  "quantity": 2.5,
  "eventId": "reward_12345"
}
```
response should be:
```{
  "success": true,
  "message": "reward created successfully"
}
```

3. GET `api/today-stocks/{userid} // use the same id as in the postreq`
response should be something like:
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

4. GET `GET /api/historical-inr/{userId}`
response:
```{
  "success": true,
  "data": [
    {
      "date": "2025-09-11",
      "totalValue": "6250.0000"
    }
  ]
}
```

5. GET `/api/stats/{userId}`
response
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

6. GET `/api/portfolio/{userId}`
response
```{
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