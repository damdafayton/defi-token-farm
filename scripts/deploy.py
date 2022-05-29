from scripts.helpers import from_, TO_WEI, get_contract
from brownie import BitUsdToken, TokenFarm, config, network
import yaml, json, os, shutil

KEPT_BALANCE = 100 * TO_WEI


def publish_source():
    return config["networks"][network.show_active()]["verify"]


def deploy_token_farm_and_bitusd_token(front_end_update=False):
    bitusd_token = BitUsdToken.deploy(from_(), publish_source=publish_source())
    token_farm = TokenFarm.deploy(
        bitusd_token.address,
        from_(),
        publish_source=publish_source(),
    )
    tx = bitusd_token.transfer(
        token_farm.address, bitusd_token.totalSupply() - KEPT_BALANCE, from_()
    )
    tx.wait(1)
    # bitusd_token, weth, fau/dai
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        bitusd_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, from_)
    if front_end_update:
        update_front_end()
    return token_farm, bitusd_token


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, from_):
    for token in dict_of_allowed_tokens:
        add_tx = token_farm.addAllowedTokens(token.address, from_())
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_tokens[token], from_()
        )
        set_tx.wait(1)
    return token_farm


def update_front_end():
    copy_folder_to_front_end("./build", "./front_end/src/chain-info")
    with open("./brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated")


def copy_folder_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_bitusd_token(front_end_update=True)
