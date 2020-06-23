//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import './Process.sol';
import '@openzepplin/contracts/ownership/rbac/RBAC.sol';

/// @title Main Contract for Nuclearis Track
/// @author Sebastian A. Martinez
/// @notice This contract is the main entrypoint for the Nuclearis Track Platform
contract NuclearPoE {
    enum State {Null, Created, Closed}

    struct Project {
        State status;
        address clientAddress;
        bytes32 title;
        bytes32 purchaseOrder;
        address[] processContracts;
    }

    address[] public processContractsArray;
    uint256[] public projectsArray;

    mapping(address => uint256[]) public projectsByAddress;
    mapping(address => address[]) public processesByAddress;
    mapping(uint256 => Project) private project;

    event CreateProject();
    event CreateProcess(address ProcessContractAddress);
    event AssignProcess(uint256 project, address ProcessContractAddress);
    event ChangeProjectStatus(uint256 id, State newState);

    modifier hasRole(address entity, string memory role) {
        require(
            roles[entity][role] || entity == owner,
            'Sender does not have the correct role'
        );
        _;
    }

    /// @notice Creates a new project
    /// @param _id Id of a new project
    /// @param _client Address of client
    /// @param _title Title of new project
    /// @param _purchaseOrder Purchase Order Id of project
    function createProject(
        uint256 _id,
        address _client,
        bytes32 _title,
        bytes32 _purchaseOrder
    ) external hasRole('project:create') {
        require(
            project[_id].status == State.Null,
            'Project already created or closed'
        );

        address[] memory processContracts = new address[](0);
        project[_id] = Project(
            State.Created,
            _client,
            _title,
            _purchaseOrder,
            processContracts
        );
        projectsByAddress[_client].push(_id);
        projectsArray.push(_id);

        emit CreateProject();
    }

    /// @notice Creates a new process and deploys contract
    /// @param _supplier Supplier Address
    /// @param _processName Name of supplier of process
    function createProcess(address _supplier, bytes32 _processName)
        external
        hasRole('process:create')
    {
        address ProcessContractAddress = address(
            new Process(roleContract, _supplier, _processName)
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
        hasRole('process:assign')
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
    function changeProjectStatus(uint256 _id)
        external
        hasRole('project:changeState')
    {
        require(
            project[_id].status == State.Created,
            'Project does not exist or is already closed'
        );

        if (project[_id].status == State.Created)
            project[_id].status = State.Closed;
        else project[_id].status = State.Created;

        emit ChangeProjectStatus(_id, project[_id].status);
    }

    /// @notice Returns all process contract addresses
    /// @return address[] Array of process contract addresses
    function getAllProcessContracts()
        external
        view
        hasRole('processes:read')
        returns (address[] memory)
    {
        return processContractsArray;
    }

    /// @notice Returns all projects
    /// @return address[] Array of all project ids
    function getProcessContractsByProject(uint256 _id)
        external
        view
        hasRole('processes:read')
        returns (address[] memory)
    {
        return project[_id].processContracts;
    }

    /// @notice Returns all projects
    /// @return uint256[] Array of all project ids
    function getAllProjects()
        external
        view
        hasRole('projects:read')
        returns (uint256[] memory)
    {
        return projectsArray;
    }

    /// @notice Returns processes assigned to a supplier
    /// @param _address The address of the supplier
    /// @return address[] Array of process contract addresses specified to a supplier
    function getProcessesByAddress(address _address)
        external
        view
        hasRole('processes:read')
        returns (address[] memory)
    {
        return (processesByAddress[_address]);
    }

    /// @notice Returns projects assigned to a client
    /// @param _address The address of the supplier
    /// @return uint256[] Array of projects ids specified to a client
    function getProjectsByAddress(address _address)
        external
        view
        hasRole('projects:read')
        returns (uint256[] memory)
    {
        return (projectsByAddress[_address]);
    }

    /// @notice Returns details of a project id
    /// @param _id The id of the project
    /// @return status Current State of project
    /// @return address Client assigned to project
    /// @return bytes32 Title of project
    /// @return bytes32 Purchase order of project
    /// @return address[] Array of process contract addresses assigned to project
    function getProjectDetails(uint256 _id)
        external
        view
        hasRole('project:read')
        returns (
            State,
            address,
            bytes32,
            bytes32,
            address[] memory
        )
    {
        return (
            project[_id].status,
            project[_id].clientAddress,
            project[_id].title,
            project[_id].oc,
            project[_id].processContracts
        );
    }
}
