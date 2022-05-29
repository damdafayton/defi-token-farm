from brownie import exceptions
import pytest
from scripts.helpers import (
    INITIAL_PRICE_VALUE,
    from_,
    get_account,
    get_contract,
    pass_if_not_local,
)
import scripts.deploy as deploy


def test_set_price_feed_contract():
    # Arrange
    pass_if_not_local(pytest)
    non_owner = from_(index=1)
    token_farm, dapp_token = deploy.deploy_token_farm_and_dapp_token()
    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(dapp_token, price_feed_address, from_())
    # Assert
    assert token_farm.tokenPriceFeedMapping(dapp_token) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(dapp_token, price_feed_address, non_owner)


def test_stake_tokens(amount_staked):
    # Arrange
    pass_if_not_local(pytest)
    token_farm, dapp_token = deploy.deploy_token_farm_and_dapp_token()
    # Act
    dapp_token.approve(token_farm.address, amount_staked, from_())
    token_farm.stakeTokens(amount_staked, dapp_token, from_())
    # Assert
    assert token_farm.stakingBalance(dapp_token, get_account()) == amount_staked
    assert token_farm.uniqueTokensStaked(get_account()) == 1
    assert token_farm.stakers(0) == get_account()
    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    pass_if_not_local(pytest)
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account)
    # Act
    token_farm.issueTokens(from_())
    print(dapp_token.balanceOf(account))
    assert dapp_token.balanceOf(account) == starting_balance + INITIAL_PRICE_VALUE
