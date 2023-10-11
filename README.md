# scriptus.noway

## SETUP
1. Run `npm install`
2. Create file `config/local.properties`
3. Login to [ngrok](https://dashboard.ngrok.com/)
4. Generate and copy AuthToken
5. Paste token in `config/local.properties`
   ```properties
   ngrok.auth.token=YOUR-NGROK-AUTH-TOKEN
   ```


# Webhook Debugger
1. Run your local service 
2. Type this on command prompt
```
npm run ngrok
```

# Waba Debugger
1. Get your waba api key
2. Paste key in `config/local.properties`
   ```properties
   wa360.api.key=YOUR-WABA-API-KEY
   ```
3. Run `npm run wabac`

* _This script will set your waba webhoook to yout local serve. Once you are done remember to point your webhook to original API on your server_

   
 
