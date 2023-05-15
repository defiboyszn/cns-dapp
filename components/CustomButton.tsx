import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { Icon } from './Icon';

export const CustomButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className='flex text-white bg-sidebar text-center flex-col justify-center hover:bg-sidebar/50 w-[108px] h-[38px] items-center rounded-[8px] gap-[8px] px-[12px] '>
                    Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className='flex text-white bg-sidebar h-[45px] items-center rounded-[8px] px-[8px]'
                  >
                    {chain.hasIcon ? (
                      <div
                        className="flex flex-col justify-center items-center"
                        style={{
                          background: chain.iconBackground,
                          width: '30px',
                          height: '30px',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="object-contain"
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    ) : chain.name}
                  </button>
                  <button onClick={openAccountModal} className='flex text-black bg-white w-[fit] h-[fit] items-center whitespace-nowrap rounded-[8px] gap-[8px] px-[12px] overflow-hidden' type="button">
                    {/* <Icon classes='' name={'link-square.svg'} size={[24, 24]} /> */}
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};