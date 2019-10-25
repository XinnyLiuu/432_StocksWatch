'use strict';
const axios = require('axios');
const APIException = require('../exceptions/APIException.js');

/**
 * The following is the url to Alpha Vantage's api
 * 
 * Each url requires query params for `symbol`, `apikey`
 */
const API_KEY = process.env.ALPHA_VANTAGE_KEY;
let monthly_data_url = process.env.ALPHA_VANTAGE_MONTHLY_URL;

/**
 * Gets stock data from API using symbol
 */
exports.getStockDataBySymbol = (req, res) => {
    const symbol = req.params.symbol;

    // Prepare url
    monthly_data_url += `&symbol=${symbol}`;
    monthly_data_url += `&apikey=${API_KEY}`;

    axios.get(monthly_data_url)
        .then(result => {
            // Check response status
            if (result.status === 200) {
                const data = result.data;

                // Check if data returned from alpha vantage is an error message
                if ('Error Message' in data) {
                    // Send error status code
                    return res.status(500).json({ Error: "Error in /api/monthly/:Stock" });
                }

                // Check if data limit is reached 
                if ('Note' in data) {
                    // Send error status code
                    return res.status(500).json({ Error: "Error in /api/monthly/:Stock" });
                }

                const json = parseData(data);

                res.setHeader("Content-Type", 'application/json');
                return res.send(json);
            }
        })
        .catch(err => {
            try {
                if (err) throw new APIException("Error in api service monthly.js", err);
            } catch (e) {
                console.log(e);
                return res.status(500).json({ Error: e.message });
            }
        });

    // Parse the data and filter out data that we do not want
    function parseData(data) {
        console.log(data["Meta Data"]);

        const metadata = data["Meta Data"];
        const symbol = metadata["2. Symbol"];
        const timezone = metadata["4. Time Zone"];

        const monthlydata = data["Monthly Time Series"];

        // JSON to be returned
        let json = {
            "symbol": symbol,
            "timezone": timezone,
            "prices": {
                "high": [], // Contains array of [date, high]
                "low": [] // Contains array of [date, low]  
            }
        };

        // Iterate through every monthly data 
        for (let key in monthlydata) {
            let date = key;
            const monthData = monthlydata[date];

            // Convert date to UTC for Highcharts
            date = new Date(date).getTime();

            // Get the highs
            const high = Math.round(parseFloat(monthData["2. high"]) * 100) / 100;
            let highArr = [];
            highArr.push(date);
            highArr.push(high);
            json["prices"]["high"].push(highArr);

            // Get the lows
            const low = Math.round(parseFloat(monthData["3. low"]) * 100) / 100;
            let lowArr = [];
            lowArr.push(date);
            lowArr.push(low);
            json["prices"]["low"].push(lowArr);
        }

        return json;
    }
}