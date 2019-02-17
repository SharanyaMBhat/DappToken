pragma solidity ^0.5.0;

import "./DappToken.sol";
contract DappTokenSale {
    address payable admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);
    constructor(DappToken _tokenContract, uint256 _tokenPrice) public{
        //Assign an admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price

        tokenPrice = _tokenPrice;

    }

    //multiply

    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x, "error");
    
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
     // keep track of number of tokens sold   
        require(msg.value == multiply (_numberOfTokens, tokenPrice),"error");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "");
        require(tokenContract.transfer(msg.sender, _numberOfTokens),"");
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    //ending token DappTokenSale

    function endSale() public {
        
        //require only admin
        require(msg.sender == admin, "");
        //transfer 
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "");

        //selfdestruct(address(admin));

    }
}