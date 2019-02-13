pragma solidity ^0.5.0;
contract DappToken
 {
    string public name = "DApp Token";
    string public symbol = "DAPP";
    string public standard = "DApp Token V1.0";

    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    //approval

    event Approval(
   address indexed _owner,
        address indexed _spender,
        uint256 _value


    );


    mapping(address => uint256) public balanceOf;
    //allowance
    mapping(address => mapping(address =>uint256)) public allowance;
   
    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value, "error");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
   
        emit Transfer(msg.sender, _to, _value);       

        return true;
    }


//allowance

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

//transferFrom

    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from],"error");
        require(_value <= allowance[_from][msg.sender],"error");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        
        return true;
    }
}