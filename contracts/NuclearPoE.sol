pragma solidity >=0.5.0 <0.7.0;

import "./Ownable.sol";
import "./Project.sol";

contract NuclearPoE is Ownable {

    struct User {
        bytes32 name;
        bool created;
    }

    address[] public projectContractsArray;
    address[] public userArray;

    mapping(uint => address) public projectContract;
    mapping(address => address[]) public userProjectContracts;
    mapping(address => User) public user;

    modifier onlyProjectContract(address _projectAddress) {
        require(msg.sender == _projectAddress, "Sender has to be project Contract");
    _;
    }

    event CreateProject(address newProjectContractAddress);
    event CreateUser();

    function createProject(uint _expediente, bytes32 _projectTitle, address _userAddress) external onlyOwner() {
        require(projectContract[_expediente] == address(0), "Project already created");
        require(user[_userAddress].created == true, "User does not exist");

        address ProjectContractAddress = address(new Project(_expediente, _projectTitle, _userAddress, msg.sender));
        projectContract[_expediente] = ProjectContractAddress;
        projectContractsArray.push(ProjectContractAddress);

        userProjectContracts[_userAddress].push(ProjectContractAddress);

        emit CreateProject(ProjectContractAddress);
    }

    function createUser(address _userAddress, bytes32 _userName) external onlyOwner() {
        require(user[_userAddress].created == false, "User already created");

        user[_userAddress] = User(_userName, true);
        userArray.push(_userAddress);

        emit CreateUser();
    }

    function kill() public {
        selfdestruct(msg.sender);
    }

    function addSupplierToProject(address _supplierAddress, address _projectAddress) external onlyProjectContract(_projectAddress) {
        require(user[_supplierAddress].created == true, "User does not exist");

        userProjectContracts[_supplierAddress].push(_projectAddress);
    }

    function getAllProjectContract() external view returns(address[] memory) {
        return projectContractsArray;
    }

    function getAllUsers() external view returns(address[] memory) {
        return userArray;
    }

}