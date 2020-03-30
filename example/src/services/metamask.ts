declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            send: (params: any)=> Promise<{error: any}&any[]>;
            on: (eventName: any, callback: any) => any;
        }
    }
}

export function hasMetaMask(): boolean {
    if (!window.ethereum) {
        return false
    }
    return window.ethereum.isMetaMask;

}

export async function installPolkadotSnap(): Promise<boolean> {
    const origin = new URL('package.json', 'http://localhost:8081').toString();
    const pluginOrigin = `wallet_plugin_${origin}`;
    try {
        await window.ethereum.send({
            method: 'wallet_enable',
            params: [{
                [pluginOrigin]: {}
            }]
        });
        console.log("Snap installed!!");
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}