export async function checkAndSwitchToMumbai() {
    // @ts-ignore
    const currentNetworkId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentNetworkId !== '0x13881') {
        try {
            // @ts-ignore
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }]
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                // User rejected network switch request
                console.log('User rejected network switch request');
            } else {
                console.error(switchError);
            }
        }
    } else {
    }
}