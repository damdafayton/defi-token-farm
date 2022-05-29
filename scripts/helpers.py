from brownie import (
    accounts,
    network,
    config,
    Contract,
    MockV3Aggregator,
    MockDAI,
    MockWETH,
    # VRFCoordinatorMock,
    # LinkToken,
)


DECIMALS = 18
TO_WEI = 10 ** DECIMALS
INITIAL_PRICE_VALUE = 2000 * TO_WEI
FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = [
    "development",
    "ganache-local",
    "ganache-app-hellish",
    "ganache-hellish",
]
OPENSEA_URL = "https://testnets.opensea.io/assets/rinkeby/{}/{}"


def from_(value=None, index=None, gasLimit=None):
    account = get_account(index)
    return {"from": account, "value": value, "gas_limit": gasLimit}


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        print(f"Running in development with account {accounts[0]}")
        return accounts[0]
    return accounts.add(config["wallets"]["test_net_key"])  # Testnet address


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAI,
    "weth_token": MockWETH
    # "vrf_coordinator": VRFCoordinatorMock,
    # "link_token": LinkToken,
}


def get_contract(contract_name):
    """This function will grab the contract address from the brownie config if defined,
    otherwise it will deploy a mock version of that contract, and return that contract
        Args:
            contract_name (string)
        Return:
            brownie.network.contract.ProjectContract: The most recently deployed version."""
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks():
    print(f"The active network is {network.show_active()}")
    print("Deploying mocks..")
    mock_price_feed = MockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE_VALUE, from_())
    print("Deploying Mock DAI..")
    dai_token = MockDAI.deploy(from_())
    print("Deploying Mock WETH..")
    weth_token = MockWETH.deploy(from_())
    print("Mocks deployed!")


def fund_with_link(contract_address, account=None, link_token=None, amount=1 * TO_WEI):
    account = account or get_account()
    link_token = link_token or get_contract("link_token")
    tx = link_token.transfer(contract_address, amount, {"from": account})
    tx.wait(1)
    print("Funded contract with LINK")
    return tx


def pass_if_not_local(pytest):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")