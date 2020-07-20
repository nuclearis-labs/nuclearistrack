// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import './Process.sol';
import './Ownable.sol';

/// @title Main Contract for Nuclearis Track
/// @author Sebastian A. Martinez
/// @notice This contract is the main entrypoint for the Nuclearistrack Platform
contract NuclearPoE is Ownable {
    enum State {Null, Created, Closed}
    enum Type {Admin, Client, Supplier}

    struct Project {
        State status;
        address clientAddress;
        string title;
        string purchaseOrder;
        address[] processContracts;
    }
    struct User {
        State status;
        Type userType;
        string name;
    }

    address[] public processContractsArray;
    address[] private users;
    uint256[] public projectsArray;

    mapping(address => uint256[]) public projectsByAddress;
    mapping(address => address[]) public processesByAddress;
    mapping(address => User) private user;
    mapping(uint256 => Project) private project;

    event CreateProject(uint256 id);
    event CreateUser(address userAddress);
    event CreateProcess(address ProcessContractAddress);
    event AssignProcess(uint256 project, address ProcessContractAddress);
    event AssignClient(uint256 project, address ClientAddress);
    event ToggleProjectStatus(uint256 id, State newState);

    modifier onlyUser() {
        require(
            user[msg.sender].status == State.Created,
            'Sender is not whitelisted'
        );
        _;
    }

    constructor(string memory _name) public {
        // Creates the admin user, similar to an owner
        user[msg.sender] = User(State.Created, Type.Admin, _name);
        users.push(msg.sender);
    }

    /// @notice Creates a new project
    /// @param _id Id of a new project
    /// @param _title Title of new project
    /// @param _purchaseOrder Purchase Order Id of project
    function createProject(
        uint256 _id,
        string calldata _title,
        string calldata _purchaseOrder
    ) external onlyOwner {
        require(
            project[_id].status == State.Null,
            'Project already created or closed'
        );

        address[] memory processContracts = new address[](0);
        project[_id] = Project(
            State.Created,
            address(0),
            _title,
            _purchaseOrder,
            processContracts
        );
        projectsArray.push(_id);

        emit CreateProject(_id);
    }

    function assignClient(uint256 _id, address _client) external onlyOwner {
        projectsByAddress[_client].push(_id);
        project[_id].clientAddress = _client;

        emit AssignClient(_id, _client);
    }

    /// @notice Creates a new user
    /// @param _type Type of user
    /// @param _address Address of user
    /// @param _name Name of user
    function createUser(
        Type _type,
        address _address,
        string calldata _name
    ) external onlyOwner {
        user[_address] = User(State.Created, _type, _name);
        users.push(_address);

        emit CreateUser(_address);
    }

    /// @notice Returns specific information about one user
    /// @param _address User Address
    /// @return Type User Type (supplier or client)
    /// @return string Name of user
    function getUser(address _address)
        external
        view
        onlyUser
        returns (
            State,
            Type,
            string memory,
            address
        )
    {
        return (
            user[_address].status,
            user[_address].userType,
            user[_address].name,
            _address
        );
    }

    /// @notice Returns all saved users
    /// @return address[] Returns array of all created users
    function getAllUsers() external view onlyOwner returns (address[] memory) {
        return users;
    }

    /// @notice Toggles a user status
    /// @param _address Address of user to be toggled
    function toggleUserStatus(address _address) external onlyOwner {
        require(user[_address].status != State.Null, 'User does not exist');

        if (user[_address].status == State.Created)
            user[_address].status = State.Closed;
        else user[_address].status = State.Created;
    }

    /// @notice Creates a new process and deploys contract
    /// @param _supplier Supplier Address
    /// @param _processName Name of supplier of process
    /// @param _processName Name of supplier of process
    function createProcess(address _supplier, string calldata _processName)
        external
        onlyOwner
    {
        address ProcessContractAddress = address(
            new Process(_supplier, _processName, owner())
        );
        processesByAddress[_supplier].push(ProcessContractAddress);
        processContractsArray.push(ProcessContractAddress);

        emit CreateProcess(ProcessContractAddress);
    }

    /// @notice Adds a process address to a specific project
    /// @param _id The id of a project
    /// @param _processContract The address of a process contract
    function addProcessToProject(uint256 _id, address _processContract)
        external
        onlyOwner
    {
        require(
            project[_id].status == State.Created,
            'Project does not exist or is closed'
        );

        project[_id].processContracts.push(_processContract);

        emit AssignProcess(_id, _processContract);
    }

    /// @notice Toggles a project status
    /// @param _id The id of a project
    function toggleProjectStatus(uint256 _id) external onlyOwner {
        require(project[_id].status != State.Null, 'Project does not exist');

        if (project[_id].status == State.Created)
            project[_id].status = State.Closed;
        else project[_id].status = State.Created;

        emit ToggleProjectStatus(_id, project[_id].status);
    }

    /// @notice Returns all processes
    /// @return address[] Array of all process contracts
    function getProcessContractsByProject(uint256 _id)
        external
        view
        returns (address[] memory)
    {
        require(
            project[_id].clientAddress == msg.sender || msg.sender == owner(),
            'Project and Client do not match'
        );
        return project[_id].processContracts;
    }

    /// @notice Returns processes assigned to a supplier
    /// @return address[] Array of process contract addresses specified to a supplier
    function getProcessesByAddress() external view returns (address[] memory) {
        if (msg.sender == owner()) {
            return processContractsArray;
        } else {
            return (processesByAddress[msg.sender]);
        }
    }

    /// @notice Returns projects assigned to a client
    /// @return uint256[] Array of projects ids specified to a client
    function getProjectsByAddress() external view returns (uint256[] memory) {
        if (msg.sender == owner()) {
            return projectsArray;
        } else {
            return (projectsByAddress[msg.sender]);
        }
    }

    /// @notice Returns details of a project id
    /// @param _id The id of the project
    /// @return status Current State of project
    /// @return address Client assigned to project
    /// @return string Title of project
    /// @return string Purchase order of project
    /// @return address[] Array of process contract addresses assigned to project
    function getProjectDetails(uint256 _id)
        external
        view
        returns (
            State,
            uint256,
            address,
            string memory,
            string memory,
            address[] memory
        )
    {
        require(
            msg.sender == project[_id].clientAddress || msg.sender == owner(),
            'User has to be assigned client or owner'
        );
        return (
            project[_id].status,
            _id,
            project[_id].clientAddress,
            project[_id].title,
            project[_id].purchaseOrder,
            project[_id].processContracts
        );
    }
}
