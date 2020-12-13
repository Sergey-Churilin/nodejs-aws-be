const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT|| 3001;

const cacheTimeLimit = 120000;
const cache = {};
const isCacheValid = () => cache.time && (Date.now() - cache.time < cacheTimeLimit);
const isProductCache =  req => req.method === "GET" && req.originalUrl === "/product";
app.use(express.json());

app.all('/*', (req, res) => {
   console.log('originalUrl', req.originalUrl);
   console.log('method', req.method);
   console.log('body', req.body);
   console.log('cache', cache)
   if (isProductCache(req) && isCacheValid()) {
       console.log("Send cache data");
       res.json(cache.data);
   }
   const recipient = req.originalUrl.split('/')[1];
   console.log(recipient);

   const recipientURL = process.env[recipient];
   console.log('recipientURL', recipientURL);

   if(recipientURL) {
       const axiosConfig = {
           method: req.method,
           url: `${recipientURL}`,
           ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
       };

       console.log('axiosConfig', axiosConfig);

       axios(axiosConfig)
           .then(response => {
               const data = response.data;
               console.log('Response from recipient', data);
               if (isProductCache(req) && !isCacheValid()) {
                   cache.time = Date.now();
                   cache.data = data;
               }
               res.json(data);
           })
           .catch(error=>{
               console.log('Some error:',JSON.stringify(error));

               if(error.response) {
                   const {status, data} = error.response;
                   res.status(status).json(data);
               } else {
                   res.status(500).json({error:error.message});
               }
           });
   } else {
       res.status(502).json({error: 'Cannot process request'});
   }
});

app.listen(PORT, () => {
   console.log(`App listening at http://localhost:${PORT}`)
});