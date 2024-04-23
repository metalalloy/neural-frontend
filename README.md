Front-end for neural network project (image scanner and text recognition)

# Setup

## Expo setup instructions

## Configure API URL(s)
Go to `neuralnet/scripts/api.js` and set the backend API URL(s)

Note: If you did not host your own [wmata-backend](https://github.com/axwhyzee/cs4366-backend/blob/main/README.md) server and are using the one hosted on the cloud, then do not modify `WMATA_API_URL`. Only modify `OCR_API_URL`
```
// For example: WMATA_API_URL = "https://e6a3-108-48-184-26.ngrok-free.app"
WMATA_API_URL = <WMATA_BACKEND_API_URL>
OCR_API_URL = <OCR_BACKEND_API_URL>
```

## Start frontend server locally
```
# install dependencies
npm i

# start server locally
npx expo start
```
