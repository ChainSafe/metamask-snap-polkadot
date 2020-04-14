export {};

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            send: (params: any)=> Promise<any>;
            on: (eventName: any, callback: any) => any;
        }
    }
}