// @ts-nocheck
import { useState, useEffect } from 'react'
import ConnectModal from './ConnectModal'

// import UAuth from '@uauth/js'

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi'
import { useIsMounted } from '../hooks/useIsMounted';
import { CustomButton } from './CustomButton';

export function Connect() {

	// const [uDauth, setUDauth] = useState()
	// // useEffect(() => {
	// // 	// console.log(location.href)
	// // 	const uDauth = new UAuth({
	// // 		clientID: "be351fdd-ad4e-4cb7-b17a-12c8f39a011a",
	// // 		redirectUri: "http://localhost:5000",
	// // 		scope: "openid wallet email profile:optional social:optional"
	// // 	})
	// // 	setUDauth(uDauth)
	// // }, [])

	const [selected, setSelected] = useState(null)
	const [isOpen, setIsOpen] = useState(false)
	const [connected, setConnected] = useState(false)

	const label = connected ? 'Disconnect' : 'Connect'

	const { openConnectModal } = useConnectModal();
	const { address, isConnected } = useAccount()
	const { disconnectAsync } = useDisconnect()

	const mounted = useIsMounted()

	const handleConnectButton = () => {
		async function check() {

			if (!connected) {
				setSelected(null)
				setIsOpen(true)
				return
			} else if (connected) {
				if (selected == 'RBK' || address != undefined) {
					// openAccountModal()
					disconnectAsync()
				}
				return
			}
		}

		check()
	}

	// login a user
	useEffect(() => {

		async function login() {

			if (selected == 'RBK' && !isConnected) {
				openConnectModal()
			}
		}

		login()

	}, [selected])


	// checks if a user is connected 
	useEffect(() => {
		if (isConnected) {
			setConnected(true)
		} else {
			setConnected(false)
			setSelected(null)
		}
	}, [isConnected])


	return (
		<>
			<ConnectModal isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected} />

			{mounted && isConnected ? <CustomButton /> : (
				<>
					<button onClick={handleConnectButton} className="relative font-clash-display text-center bg-[#212121] px-3 py-3 w-40 rounded-[10px]">
						<span style={{
							fontSize:
								12
							, fontWeight: 500
						}}
							className="font-clash-display block  transition text-[#fff] md:text-[#fff] break-words">
							{label === "Disconnect" ? `${address?.toLowerCase().substr(0, 5)}...${address?.toLowerCase().substr(38, 42)}` : label}
						</span>
					</button>
				</>
			)}
		</>
	)
}