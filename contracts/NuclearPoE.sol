pragma solidity >=0.5.0 <0.7.0;

import "./Ownable.sol";
import "./Process.sol";

contract NuclearPoE is Ownable {

    uint public docNumber = 0;

    struct User {
        bytes32 name;
        uint8 userType;
        bool status;
    }

    struct Project {
        bool active;
        address clientAddress;
        bytes32 title;
        bytes32 oc;
        address[] processContracts;
    }

    address[] public processContractsArray;
    uint[] public projectsArray;
    address[] public usersArray;

    mapping (address => uint[]) public clientProjects;
    mapping (address => address[]) public supplierProcesses;
    mapping (address => User) public user;
    mapping (uint => Project) private project;

    modifier onlyProcessContract(address _processAddress) {
        require(msg.sender == _processAddress, "Sender has to be project Contract");
    _;
    }

    modifier onlyClient(address _clientAddress) {
        require(msg.sender == _clientAddress, "Only clients of this project can realize this operation");
        _;
    }

    event CreateProject();
    event CreateUser();
    event CreateProcess(address ProcessContractAddress);
    event CloseProject();
    event ChangePassphrase(address ActualAddress, address NewAddress);

    function createProject(uint _expediente, address _clientAddress, bytes32 title, bytes32 oc) external onlyOwner() {
        require(project[_expediente].active == false, "Project already created");
        require(user[_clientAddress].status == true, "User does not exist");

        address[] memory processContracts = new address[](0);
        project[_expediente] = Project(true, _clientAddress, title, oc, processContracts);
        clientProjects[_clientAddress].push(_expediente);
        projectsArray.push(_expediente);

        emit CreateProject();
    }

    function createUser(address _userAddress, uint8 _userType, bytes32 _userName) external onlyOwner() {
        require(user[_userAddress].status == false, "User already created");

        user[_userAddress] = User(_userName, _userType, true);
        usersArray.push(_userAddress);

        emit CreateUser();
    }

    function changeUserStatus(address _userAddress) external onlyOwner() {
        require(user[_userAddress].status == true, "User already created");

        user[_userAddress].status = !user[_userAddress].status;
    }

    function createProcess(address _supplierAddress, bytes32 _processName) external onlyOwner() {
        require(user[_supplierAddress].status == true, "User does not exist");

        address ProcessContractAddress = address(new Process(msg.sender, _processName));
        processContractsArray.push(ProcessContractAddress);

        emit CreateProcess(ProcessContractAddress);
    }

    function changePassphrase(address _newAddress) external {
        require(user[msg.sender].created == true, "User does not exist");

        user[_newAddress] = user[msg.sender];
        if(user[msg.sender].userType == 1) {
            supplierProcesses[_newAddress] = supplierProcesses[msg.sender];
        }
        else {
            clientProjects[_newAddress] = clientProjects[msg.sender];
        }
        emit ChangePassphrase(msg.sender, _newAddress);
    }

    function addProcessToProject(uint _expediente, address _processContract) external onlyOwner() {
        require(project[_expediente].active == true, "Project does not exist or is closed");

        project[_expediente].processContracts.push(_processContract);
    }

    function closeProject(uint _expediente) external onlyOwner() {
        require(project[_expediente].active == true, "Project does not exist or is already closed");

        project[_expediente].active = false;
        emit CloseProject();
    }

    function incrementDocNumber(address _processAddress) external onlyProcessContract(_processAddress) returns(uint) {
        docNumber++;
        return docNumber;
    }

    function getAllProcessContracts() external view returns(address[] memory) {
        return processContractsArray;
    }

    function getProcessContractsByProject(uint _expediente) external view returns(address[] memory) {
        return project[_expediente].processContracts;
    }

    function getAllProjects() external view returns(uint[] memory) {
        return projectsArray;
    }

    function getAllUsers() external view returns(address[] memory) {
        return usersArray;
    }

    function getClientDetails(address _address) external view returns(bytes32, uint8, uint[] memory) {
        return (user[_address].name, user[_address].userType, clientProjects[_address]);
    }

    function getSupplierDetails(address _address) external view returns(bytes32, uint8, address[] memory) {
        return (user[_address].name, user[_address].userType, supplierProcesses[_address]);
    }

    function getProjectDetails(uint _expediente) external view returns(bool, address, bytes32, bytes32, address[] memory) {
        return (
            project[_expediente].active,
            project[_expediente].clientAddress,
            project[_expediente].title,
            project[_expediente].oc,
            project[_expediente].processContracts);
    }

}