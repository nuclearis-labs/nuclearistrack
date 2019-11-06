pragma solidity >=0.5.0 <0.7.0;

import "./Ownable.sol";
import "./Process.sol";

contract NuclearPoE is Ownable {

    uint public docNumber = 0;
    enum State { Null, Created, Closed}
    enum Type { Client, Supplier }

    struct User {
        bytes32 name;
        Type userType;
        State status;
    }

    struct Project {
        State status;
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
        require(user[msg.sender].userType == Type.Client, "Sender is not client type");
        _;
    }

    modifier onlyExistingUser(address _address) {
        require(user[_address].status != State.Null, "User does not exist");
        _;
    }

    event CreateProject();
    event CreateUser();
    event CreateProcess(address ProcessContractAddress);
    event CloseProject(uint id);
    event ChangeUserStatus(address UserAddress, State UserState);

    function createProject(
        uint _id,
        address _clientAddress,
        bytes32 title,
        bytes32 oc
    ) external onlyOwner() onlyExistingUser(_clientAddress) {
        require(project[_id].status == State.Null, "Project already created or closed");
        require(user[_clientAddress].userType == Type.Client, "User has to be Client Type");

        address[] memory processContracts = new address[](0);
        project[_id] = Project(State.Created, _clientAddress, title, oc, processContracts);
        clientProjects[_clientAddress].push(_id);
        projectsArray.push(_id);

        emit CreateProject();
    }

    function createUser(address _userAddress, Type _userType, bytes32 _userName) external onlyOwner() {
        require(user[_userAddress].status == State.Null, "User already created");

        user[_userAddress] = User(_userName, _userType, State.Created);
        usersArray.push(_userAddress);

        emit CreateUser();
    }

    function changeUserStatus(address _userAddress) external onlyOwner() onlyExistingUser(_userAddress) {
        if(user[_userAddress].status == State.Created) user[_userAddress].status = State.Closed;
        else user[_userAddress].status = State.Created;

        emit ChangeUserStatus(_userAddress, user[_userAddress].status);
    }

    function createProcess(address _supplierAddress, bytes32 _processName) external onlyOwner() onlyExistingUser(_supplierAddress) {
        require(user[_supplierAddress].userType == Type.Supplier, "User has to be Supplier Type");

        address ProcessContractAddress = address(new Process(_supplierAddress, _processName));
        processContractsArray.push(ProcessContractAddress);

        emit CreateProcess(ProcessContractAddress);
    }

    function addProcessToProject(uint _id, address _processContract) external onlyOwner() {
        require(project[_id].status == State.Created, "Project does not exist or is closed");

        project[_id].processContracts.push(_processContract);
    }

    function changeProjectStatus(uint _id) external onlyOwner() {
        require(project[_id].status == State.Created, "Project does not exist or is already closed");

        if(project[_id].status == State.Created) project[_id].status = State.Closed;
        else project[_id].status = State.Created;

        emit CloseProject(_id);
    }

    // Receives input from corresponding Process Contract and returns new Doc Number
    function incrementDocNumber(address _processAddress) external onlyProcessContract(_processAddress) returns(uint) {
        docNumber++;
        return docNumber;
    }

    function getAllProcessContracts() external view returns(address[] memory) {
        return processContractsArray;
    }

    function getProcessContractsByProject(uint _id) external view returns(address[] memory) {
        return project[_id].processContracts;
    }

    function getAllProjects() external view returns(uint[] memory) {
        return projectsArray;
    }

    function getAllUsers() external view returns(address[] memory) {
        return usersArray;
    }

    function getUserDetails(address _address) external view returns(bytes32, Type, State) {
        return (user[_address].name, user[_address].userType, user[_address].status);
    }

    function getSupplierProjects(address _address) external view returns(address[] memory) {
        return (supplierProcesses[_address]);
    }

    function getClientProjects(address _address) external view returns(uint[] memory) {
        return (clientProjects[_address]);
    }

    function getProjectDetails(uint _id) external view returns(State, address, bytes32, bytes32, bytes32, address[] memory) {
        address clientAddress = project[_id].clientAddress;
        bytes32 clientName = user[clientAddress].name;
        return (
            project[_id].status,
            project[_id].clientAddress,
            clientName,
            project[_id].title,
            project[_id].oc,
            project[_id].processContracts);
    }

}