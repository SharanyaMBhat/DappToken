var DappToken = artifacts.require("./DappToken.sol");


contract('DappToken', function(accounts){
var tokenInstance;

it('initialises', function(){
    return DappToken.deployed().then(function(instance){
        tokenInstance = instance;
        return tokenInstance.name();
    }).then(function(name){
        assert.equal(name,'DApp Token', 'has correct name');
        return tokenInstance.symbol();
    }).then(function(symbol){
        assert.equal(symbol,'DAPP','has the correct symbol');
        return tokenInstance.standard();
    }).then(function(standard){
    assert.equal(standard,'DApp Token V1.0','has the correct standard');
});
    });
 
    it('allocates initial supply upon deployment', function(){
        return DappToken.deployed().then(function(instance){

            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1000,000');
            return tokenInstance.balanceOf(accounts[0]).then(function(adminBalance){
                assert.equal(adminBalance.toNumber(), 1000000,'allocates to admin')
            })
        });
    });

    it('tranfers token ownership', function(){

        return DappToken.deployed().then(function(instance){

            tokenInstance=instance;
            return tokenInstance.transfer.call(accounts[1],99999999999999);
        }).then(assert.fail).catch(function(error){

            assert(error.message.indexOf('revert')>=0,'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1],250000, {from: accounts[0]}).then(function(success){

                assert.equal(success,true,'It returns true')
         
            return tokenInstance.transfer(accounts[1],250000,{from: accounts[0]}).then(function(reciept){


            assert.equal(reciept.logs.length, 1, 'triggers an event');
            assert.equal(reciept.logs[0].event, 'Transfer', 'should be Transfer event');
            assert.equal(reciept.logs[0].args._from, accounts[0], 'logs out sender');
            assert.equal(reciept.logs[0].args._to, accounts[1], 'logs out reciever');
            assert.equal(reciept.logs[0].args._value, 250000, 'logs tranfer amount of an event');
            
            return tokenInstance.balanceOf(accounts[1]);
        })   }).then(function(balance){
            assert.equal(balance.toNumber(),250000,'adds to reciver');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){

            assert.equal(balance.toNumber(), 750000,'deducts from sender');
        });
        
        
        })
    });

        it('approves tokens for delegated transfer', function(){
    return DappToken.deployed().then(function(instance){

        tokenInstance=instance;
        return tokenInstance.approve.call(accounts[1], 100);
    }).then(function(success){
        assert.equal(success, true, 'it returns true');
    return tokenInstance.approve(accounts[1],100);    
    }).then(function(reciept){
        assert.equal(reciept.logs.length, 1, 'triggers an event');
        assert.equal(reciept.logs[0].event, 'Approval', 'should be Approval event');
        assert.equal(reciept.logs[0].args._owner, accounts[0], 'logs out owner');
        assert.equal(reciept.logs[0].args._spender, accounts[1], 'logs out spender');
        assert.equal(reciept.logs[0].args._value, 100, 'logs tranfer amount of an event');
       return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance){
        assert.equal(allowance.toNumber(), 100, 'stores allowance for delegated transfer');
    });
});

   
it('handles delegated token transfer',function(){

    return DappToken.deployed().then(function(instance){
        tokenInstance = instance;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];

        //transfer tokens to fromAccount

        return tokenInstance.transfer(fromAccount,100,{ from: accounts[0]});
    }).then(function(reciept){
        //Approve spendingAccount to spend 10 tokens from fromAccount

        return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
    }).then(function(reciept){
//Try something larger than senders balance

return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount

})
    }).then(assert.fail).catch(function(error){
        assert(error.message.toString().indexOf('revert')>=0,'cannot transfer value larger than balance');

        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount})
            }).then(assert.fail).catch(function(error){
                assert(error.message.toString().indexOf('revert')>=0,'cannot transfer value larger than approved amount');
                return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
            }).then(function(success){
                assert.equal(success, true);
                return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
       
             }).then(function(reciept){
                assert.equal(reciept.logs.length, 1, 'triggers an event');
                assert.equal(reciept.logs[0].event, 'Transfer', 'should be Transfer event');
                assert.equal(reciept.logs[0].args._from, fromAccount, 'logs out sender');
                assert.equal(reciept.logs[0].args._to, toAccount, 'logs out reciever');
                assert.equal(reciept.logs[0].args._value, 10, 'logs tranfer amount of an event');
             return tokenInstance.balanceOf(fromAccount);
             }).then(function(balance){
                 assert.equal(balance.toNumber(), 90, 'deducts amount from sender');
                 return tokenInstance.balanceOf(toAccount);
          
                }).then(function(balance){
                    assert.equal(balance.toNumber(), 10, 'adds amount to reciever');
                    return tokenInstance.allowance(fromAccount, spendingAccount);
            }).then(function(allowance){
                assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    });
});