import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ZetaChain, mumbai, celoTestnet } from '../connectors/chain';


const { chains, publicClient } = configureChains(
  [ZetaChain, mumbai],
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'VestFunds',
  chains
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors
})


export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component?.getLayout || ((page) => page)
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        {
          getLayout(
            <Component {...pageProps} />
          )
        }
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
