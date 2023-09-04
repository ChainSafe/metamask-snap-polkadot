"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = exports.polkadotConfiguration = exports.westendConfiguration = exports.kusamaConfiguration = exports.getDefaultConfiguration = void 0;
function getDefaultConfiguration(networkName) {
    switch (networkName) {
        case 'polkadot':
            console.log('Polkadot configuration selected');
            return exports.polkadotConfiguration;
        case 'kusama':
            console.log('Kusama configuration selected');
            return exports.kusamaConfiguration;
        case 'westend':
            console.log('Westend configuration selected');
            return exports.westendConfiguration;
        default:
            return exports.defaultConfiguration;
    }
}
exports.getDefaultConfiguration = getDefaultConfiguration;
exports.kusamaConfiguration = {
    addressPrefix: 2,
    networkName: 'kusama',
    unit: {
        decimals: 12,
        image: 'https://svgshare.com/i/L3o.svg',
        symbol: 'KSM'
    },
    wsRpcUrl: 'https://kusama-rpc.polkadot.io/'
};
exports.westendConfiguration = {
    addressPrefix: 42,
    networkName: 'westend',
    unit: {
        decimals: 12,
        image: 'https://svgshare.com/i/L2d.svg',
        symbol: 'WND'
    },
    wsRpcUrl: 'https://westend-rpc.polkadot.io/'
};
exports.polkadotConfiguration = {
    addressPrefix: 0,
    networkName: 'polkadot',
    unit: {
        decimals: 12,
        image: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
        symbol: 'DOT'
    },
    wsRpcUrl: 'https://rpc.polkadot.io/'
};
exports.defaultConfiguration = exports.westendConfiguration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQix1QkFBdUIsQ0FBQyxXQUFtQjtJQUN6RCxRQUFRLFdBQVcsRUFBRTtRQUNuQixLQUFLLFVBQVU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFDL0MsT0FBTyw2QkFBcUIsQ0FBQztRQUMvQixLQUFLLFFBQVE7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDN0MsT0FBTywyQkFBbUIsQ0FBQztRQUM3QixLQUFLLFNBQVM7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDOUMsT0FBTyw0QkFBb0IsQ0FBQztRQUM5QjtZQUNFLE9BQU8sNEJBQW9CLENBQUM7S0FDL0I7QUFDSCxDQUFDO0FBZEQsMERBY0M7QUFFWSxRQUFBLG1CQUFtQixHQUFlO0lBQzdDLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRSxFQUFFO1FBQ1osS0FBSyxFQUFFLGdDQUFnQztRQUN2QyxNQUFNLEVBQUUsS0FBSztLQUNkO0lBQ0QsUUFBUSxFQUFFLGlDQUFpQztDQUM1QyxDQUFDO0FBRVcsUUFBQSxvQkFBb0IsR0FBZTtJQUM5QyxhQUFhLEVBQUUsRUFBRTtJQUNqQixXQUFXLEVBQUUsU0FBUztJQUN0QixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxnQ0FBZ0M7UUFDdkMsTUFBTSxFQUFFLEtBQUs7S0FDZDtJQUNELFFBQVEsRUFBRSxrQ0FBa0M7Q0FDN0MsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQWU7SUFDL0MsYUFBYSxFQUFFLENBQUM7SUFDaEIsV0FBVyxFQUFFLFVBQVU7SUFDdkIsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEVBQUU7UUFDWixLQUFLLEVBQUUsbUVBQW1FO1FBQzFFLE1BQU0sRUFBRSxLQUFLO0tBQ2Q7SUFDRCxRQUFRLEVBQUUsMEJBQTBCO0NBQ3JDLENBQUM7QUFFVyxRQUFBLG9CQUFvQixHQUFlLDRCQUFvQixDQUFDIn0=