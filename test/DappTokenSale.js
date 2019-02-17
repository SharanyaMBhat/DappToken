var DappTokenSale = artifacts.require("./DappTokenSale.sol");
var DappToken = artifacts.require("./DappToken.sol");


contract('DappTokenSale', function(accounts){
    var tokenSaleInstance;
    var tokenPrice= 1000000000000000 // in wei 
    var buyer = accounts[1];
    var admin = accounts[0];
    var tokensAvailable = 750000;
    var numberOfTokens;
    it('initialises the contract with correct values',function(){
 

return DappTokenSale.deployed().then(function(instance){
    tokenSaleInstance = instance;
    return tokenSaleInstance.address
}).then(function(address){

    assert.notEqual(address, 0x0000000, 'has contract address');
    return tokenSaleInstance.tokenContract();

}).then(function(address){
    assert.notEqual(address, 0x0000000, 'has token contract address');
    return tokenSaleInstance.tokenPrice();
}).then(function(price){
    assert.equal(price, tokenPrice, ' token price is correct');
});
    });

it('facilitates token buying', function(){
    return DappToken.deployed().then(function(instance){
    tokenInstance = instance;
    return DappTokenSale.deployed();}).then(function(instance){
    tokenSaleInstance = instance;
    return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
    }).then(function(reciept){
    numberOfTokens = 10;
    return tokenSaleInstance.buyTokens(numberOfTokens, {from:buyer, value: numberOfTokens * tokenPrice});
    
    }).then(function(reciept){
        assert.equal(reciept.logs.length, 1, 'triggers an event');
        assert.equal(reciept.logs[0].event, 'Sell', 'should be Sell event');
        assert.equal(reciept.logs[0].args._buyer, buyer, 'logs out sender');
        assert.equal(reciept.logs[0].args._amount, numberOfTokens, 'logs out reciever');
          
        return tokenSaleInstance.tokensSold();
    }).then(function(amount){
        assert.equal(amount.toNumber(), numberOfTokens, 'increments number of tokens sold');
        return tokenSaleInstance.balanceOf(buyer);
  

    }).then(function(balance){
        assert.equal(balance.toNumber(), numberOfTokens, 'increments number of tokens sold');
        return tokenSaleInstance.balanceOf(tokenSaleInstance.address);
  
    })
    .then(function(balance){
        assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'increments number of tokens sold');
        return tokenSaleInstance.buyTokens(numberOfTokens, {from:buyer, value: 1});
  
    })
    // .then(assert.fail).catch(function(error){
    //     assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');   
    //     return tokenSaleInstance.buyTokens(800000, {from:buyer, value: numberOfTokens * tokenPrice});
  
    // })
    .then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');   
       });

});


it('ends token sale',  function(){
    return DappToken.deployed().then(function(instance){
    tokenInstance = instance;
    return DappTokenSale.deployed();
}).then(function(instance){
    tokenSaleInstance = instance;
return tokenSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert')>=0, 'must be admin to end sale');
            return tokenSaleInstance.endSale({from: admin});
        }).then(function(reciept){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 1000000, 'returns all unsold dapp tokens to admin');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
         //   assert.equal(price.toNumber(), 0, 'token price reset')
        })
    })

});