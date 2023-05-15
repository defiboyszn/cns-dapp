import type { AddEthereumChainParameter } from '@web3-react/types'
import { Chain as _Chain } from 'wagmi';
import { celoAlfajores,polygonMumbai } from 'wagmi/chains'


const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Celo',
  symbol: 'CELO',
  decimals: 18,
}
const COREDAO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Core Chain MainNet',
  symbol: 'CORE',
  decimals: 18,
}
const COREDAOTESTNET: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Core Chain TestNet',
  symbol: 'tCORE',
  decimals: 18,
}
const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Binance Smartchain',
  symbol: 'BNB',
  decimals: 18,
}

interface BasicChainInformation {
  rpcUrls: (string | undefined)[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}
const getInfuraUrlFor = (network: string) =>
  process.env.infuraKey ? `https://${network}.infura.io/v3/${process.env.infuraKey}` : undefined
const getAlchemyUrlFor = (network: string) =>
  process.env.alchemyKey ? `https://${network}.alchemyapi.io/v2/${process.env.alchemyKey}` : undefined

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation }

export const MAINNET_CHAINS: ChainConfig = {
  1: {
    rpcUrls: [getInfuraUrlFor('mainnet'), getAlchemyUrlFor('eth-mainnet'), 'https://cloudflare-eth.com'].filter(Boolean),
    name: 'Ethereum',
  },
  10: {
    rpcUrls: [getInfuraUrlFor('optimism-mainnet'), 'https://mainnet.optimism.io'].filter(Boolean),
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  56: {
    rpcUrls: ['https://bsc-dataseed.binance.org/'].filter(Boolean),
    name: 'Binance',
    nativeCurrency: BNB,
    blockExplorerUrls: ['https://bscscan.com'],
  },
  42161: {
    rpcUrls: [getInfuraUrlFor('arbitrum-mainnet'), 'https://arb1.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  137: {
    rpcUrls: [getInfuraUrlFor('polygon-mainnet'), 'https://polygon-rpc.com'].filter(Boolean),
    name: 'Polygon',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  42220: {
    rpcUrls: ['https://forno.celo.org'],
    name: 'Celo',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
  1116: {
    rpcUrls: ["https://rpc.coredao.org/"],
    name: "Core Chain MainNet",
    nativeCurrency: COREDAO,
    blockExplorerUrls: ["https://scan.coredao.org/"]
  }
}

export const TESTNET_CHAINS: ChainConfig = {
  5: {
    rpcUrls: [getInfuraUrlFor('goerli')].filter(Boolean),
    name: 'Görli',
  },
  420: {
    rpcUrls: [getInfuraUrlFor('optimism-goerli'), 'https://goerli.optimism.io'].filter(Boolean),
    name: 'Optimism Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  },
  421613: {
    rpcUrls: [getInfuraUrlFor('arbitrum-goerli'), 'https://goerli-rollup.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  80001: {
    rpcUrls: [getInfuraUrlFor('polygon-mumbai')].filter(Boolean),
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  44787: {
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    name: 'Celo Alfajores',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
  },
}

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
}

type Chain = _Chain & {
  iconUrl: string,
  iconBackground: string,
  id: number
  name: string,
  network: string
}

export const core = {
  id: 1116,
  name: 'CORE Chain',
  network: 'core',
  iconUrl: '/core-dao-logo.webp',
  iconBackground: '#fff',
  nativeCurrency: COREDAO,
  rpcUrls: {
    public: { http: ["https://rpc.coredao.org/"] },
    default: { http: ["https://rpc.coredao.org/"] },
  },
  blockExplorers: {
    core: { name: 'Core', url: 'https://scan.coredao.org/' },
    default: { name: 'Core', url: 'https://scan.coredao.org/' },
    // default: ""
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;
export const coreTestnet = {
  id: 1115,
  name: 'CORE Chain Testnet',
  network: 'core',
  iconUrl: '/core-dao-logo.webp',
  iconBackground: '#fff',
  nativeCurrency: COREDAOTESTNET,
  rpcUrls: {
    public: { http: ["https://rpc.test.btcs.network/"] },
    default: { http: ["https://rpc.test.btcs.network/"] },
  },
  blockExplorers: {
    core: { name: 'Core', url: 'https://scan.test.btcs.network/' },
    default: { name: 'Core', url: 'https://scan.test.btcs.network/' },
    // default: ""
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
  testnet: true,
} as const satisfies Chain
export const celoTestnet: Chain = {
  iconUrl: '/celo-logo.png',
  iconBackground: '#fff',
  ...celoAlfajores
} as const satisfies Chain
export const mumbai: Chain = {
  iconUrl: '/matic-logo.png',
  iconBackground: '#fff',
  ...polygonMumbai
} as const satisfies Chain

export const ZetaChain: Chain = {
  id: 7001,
  name: 'ZetaChain Testnet',
  network: ' ZetaChain Testnet',
  iconUrl: '/zetachain-logo.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'ZetaChain',
    symbol: 'ZETA',
  },
  rpcUrls: {
    default: {
      http: ['https://api.athens2.zetachain.com/evm'],
    },
    public: {
      http: ['https://api.athens2.zetachain.com/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ZetaChain', url: 'https://explorer.zetachain.com/evm'
    },
  },
  testnet: true,
} as const satisfies Chain