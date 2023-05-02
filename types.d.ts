interface Ethereum {
    isMetaMask?: boolean;
    enable?: () => Promise<string[]>;
    on?: (eventName: string, callback: Function) => void;
    removeListener?: (eventName: string, callback: Function) => void;
    autoRefreshOnNetworkChange?: boolean;
    chainId?: string;
    networkVersion?: string;
    selectedAddress?: string;
    isApproved?: (options: { origin: string }) => Promise<boolean>;
    request?: (request: { method: string; params?: any[] }) => Promise<any>;
    send?: (request: { method: string; params?: any[] }) => Promise<any>;
  }
  
//   declare global {
//     interface Window {
//       ethereum?: Ethereum;
//     }
//   }
  