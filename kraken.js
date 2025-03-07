document.addEventListener("DOMContentLoaded", function () {

    const style = document.createElement("style");
    style.innerHTML = `
        body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            background-color: white;
            color: black;
            overflow: hidden;
        }
        .ticker-wrapper {
            width: 100%;
            overflow: hidden;
            background: white;
            padding: 10px 0;
            display: flex;
            align-items: center;
            position: relative;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }
        .ticker {
            display: flex;
            white-space: nowrap;
            animation: scroll 50s linear infinite;
        }
        .ticker-wrapper:hover {
            cursor: pointer;
        }
        .ticker-wrapper:hover .ticker {
            animation-play-state: paused;
        }
        .ticker span {
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-right: 15px;
        }
        .ticker img {
            width: 20px;
            height: 20px;
             margin-right: 4px !important;
            margin-left: 4px !important;
        }
        .coin-name {
            font-weight: bold;
            font-size: 20px;
            margin-right: 4px !important;
            margin-left: 4px !important;
        }
        .coin-symbol {
            font-size: 12px;
            color: gray;
            font-weight: lighter;
           margin-right: 4px !important;
            margin-left: 4px !important;
        }
        .powered-by {
            font-size: 12px;
            color: gray;
            font-weight: lighter;
            margin-left: 10px;
            display: flex;
            align-items: center;
        }
        .powered-by img {
            width: 70px;
            height: auto;
            margin-left: 5px;
        }
        .green { color: #4CAF50; }
        .red { color: #FF5252; }
        .arrow {
            width: 14px;
            height: 14px;
            margin-left: 4px;
        }
        @keyframes scroll {
            from {
                transform: translateX(0);
            }
            to {
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(style);

    // Create ticker wrapper
    const tickerWrapper = document.createElement("div");
    tickerWrapper.className = "ticker-wrapper";
    tickerWrapper.onclick = () => {
        window.open('https://kraken.pxf.io/c/6063359/687155/10583', '_blank');
    };

    // Create ticker container
    const tickerDiv = document.createElement("div");
    tickerDiv.className = "ticker";
    tickerDiv.id = "cryptoTicker";

    tickerWrapper.appendChild(tickerDiv);
    document.body.appendChild(tickerWrapper);

    async function fetchCryptoPrices() {
        const krakenSymbols = [
            "XXBTZUSD", "XETHZUSD", "XXRPZUSD", "SOLUSD", "ADAUSD",
            "XDGUSD", "TRXUSD", "LINKUSD", "XXLMZUSD", "DOTUSD"
        ];

        try {
            const response = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${krakenSymbols.join(",")}`);
            const data = await response.json();

            const symbols = {
                "XXBTZUSD": { name: "Bitcoin", symbol: "BTC", icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
                "XETHZUSD": { name: "Ethereum", symbol: "ETH", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
                "XXRPZUSD": { name: "XRP", symbol: "XRP", icon: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
                "SOLUSD": { name: "Solana", symbol: "SOL", icon: "https://cryptologos.cc/logos/solana-sol-logo.png" },
                "ADAUSD": { name: "Cardano", symbol: "ADA", icon: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
                "XDGUSD": { name: "Dogecoin", symbol: "DOGE", icon: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
                "TRXUSD": { name: "Tron", symbol: "TRX", icon: "https://cryptologos.cc/logos/tron-trx-logo.png" },
                "LINKUSD": { name: "Chainlink", symbol: "LINK", icon: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
                "XXLMZUSD": { name: "Stellar", symbol: "XLM", icon: "https://cryptologos.cc/logos/stellar-xlm-logo.png" },
                "DOTUSD": { name: "Polkadot", symbol: "DOT", icon: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
            };

            let tickerHTML = '';
            let count = 0;
            for (const pair in symbols) {
                if (data.result[pair]) {
                    const price = parseFloat(data.result[pair].c[0]);
                    const openPrice = parseFloat(data.result[pair].o);
                    const percentageChange = ((price - openPrice) / openPrice * 100).toFixed(2);
                    const changeClass = percentageChange >= 0 ? 'green' : 'red';
                    const arrow = percentageChange >= 0
                        ? '<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="green"><path d="M137.4 137.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128z"></path></svg>'
                        : '<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="red"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>';

                    tickerHTML += `<span>
                        <img src="${symbols[pair].icon}" alt="${symbols[pair].name}" crossorigin="anonymous">
                        <span class="coin-name">${symbols[pair].name}</span><span class="coin-symbol">${symbols[pair].symbol}</span>&nbsp;
                        $${price.toFixed(2)}
                        <span class="${changeClass}">${arrow} ${percentageChange}%</span>
                    </span>`;

                    if (count % 5 === 0) {
                        tickerHTML += `<span class="powered-by">Powered by <img src="https://qureshisosama1996.github.io/Widget/krakenlogo.png" alt="Kraken"></span>`;
                    }
                    count++;
                }
            }
            tickerDiv.innerHTML = tickerHTML + tickerHTML;
        } catch (error) {
            console.error("Error fetching crypto prices:", error);
        }
    }

    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 30000);
});
