import { BigNumberish, constants } from "ethers"
import { formatUnits } from "ethers/lib/utils"

import brownieConfig from "./brownie-config.json" // implicit conversion to object
import networkMapping from "./chain-info/deployments/map.json"

export const imageMapping = { weth: "eth", fau: "dai", bitusd: "cusdc" }

export const networkMap = {
  "42": "kovan",
  "4": "rinkeby",
  "1337": "development",
  "dev": "development"
}

export const formatTokenBalance = (tokenBalance: BigNumberish): number => parseFloat(formatUnits(tokenBalance, 18))

export function getContractAddress(
  { external_contract = null,
    own_contract = null,
    chainId = undefined }:
    {
      external_contract?: string | null,
      own_contract?: string | null,
      chainId: number | undefined
    }) {
  // own own_contracts deployed to testnet / get them from build maps
  if (own_contract) {
    let stringChainId = String(chainId)
    return chainId && networkMapping[stringChainId]
      ? networkMapping[stringChainId][own_contract][0]
      : constants.AddressZero
  } else if (external_contract) {
    // testnet feeds / get them from brownie-config
    const networkName = networkMap[chainId || "dev"]
    return chainId &&
      brownieConfig["networks"][networkName] &&
      brownieConfig["networks"][networkName][external_contract] ||
      constants.AddressZero
  }
}


