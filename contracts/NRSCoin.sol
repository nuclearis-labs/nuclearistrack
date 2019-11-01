pragma solidity >=0.4.22 <0.6.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract NRSCoin is Ownable{

		string public name;
		string public symbol;
		uint8 public decimals;
    uint public _totalSupply;

    mapping (address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint value);
		event Burn(address indexed from, uint value);
    event Approval(address indexed from, address indexed to, uint value);
    event Mint(uint value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(uint initialSupply, string memory tokenName, string memory tokenSymbol, address tokenowner) public {
				balanceOf[msg.sender] = initialSupply;
				decimals = 18;
				name = tokenName;
				symbol = tokenSymbol;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function transfer(address _from, address _to, uint _value) public {
        /* Check if sender has balance and for overflows */
        require(balanceOf[_from] >= _value && balanceOf[_to] + _value >= balanceOf[_to], "Not enough balance");

        /* Add and subtract new balances */
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

		function mint(uint _value) external onlyOwner() returns (bool)  {
        _totalSupply = _totalSupply += _value;
        balanceOf[msg.sender] = balanceOf[msg.sender] += _value;

        emit Mint(_value);
    }

		function burn(uint _value) external onlyOwner() returns (bool)  {
        require(balanceOf[msg.sender] >= _value, "Sender does not have tokens to burn");

        balanceOf[msg.sender] -= _value;
        _totalSupply -= _value;

        emit Burn(msg.sender, _value);
    }

}
