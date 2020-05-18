pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './RoleBasedAcl.sol';
import './Process.sol';


contract NuclearPoE is RoleBasedAcl {
    enum State {Null, Created, Closed}

    struct Project {
        State status;
        address clientAddress;
        bytes32 title;
        bytes32 oc;
        address[] processContracts;
    }

    address[] public processContractsArray;
    uint256[] public projectsArray;

    mapping(address => uint256[]) public projectsByAddress;
    mapping(address => address[]) public processesByAddress;
    mapping(uint256 => Project) private project;

    event CreateProject();
    event CreateProcess(address ProcessContractAddress);
    event CloseProject(uint256 id);

    function createProject(
        uint256 _id,
        address _clientAddress,
        bytes32 title,
        bytes32 oc
    ) external hasRole('project:create') {
        require(
            project[_id].status == State.Null,
            'Project already created or closed'
        );

        address[] memory processContracts = new address[](0);
        project[_id] = Project(
            State.Created,
            _clientAddress,
            title,
            oc,
            processContracts
        );
        projectsByAddress[_clientAddress].push(_id);
        projectsArray.push(_id);

        emit CreateProject();
    }

    function createProcess(address _supplierAddress, bytes32 _processName)
        external
        hasRole('process:create')
    {
        address ProcessContractAddress = address(
            new Process(_supplierAddress, _processName)
        );
        processesByAddress[_supplierAddress].push(ProcessContractAddress);
        processContractsArray.push(ProcessContractAddress);

        emit CreateProcess(ProcessContractAddress);
    }

    function addProcessToProject(uint256 _id, address _processContract)
        external
        hasRole('process:assign')
    {
        require(
            project[_id].status == State.Created,
            'Project does not exist or is closed'
        );

        project[_id].processContracts.push(_processContract);
    }

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

        emit CloseProject(_id);
    }

    // TODO: Add hasRole modifier
    function getAllProcessContracts() external view returns (address[] memory) {
        return processContractsArray;
    }

    function getProcessContractsByProject(uint256 _id)
        external
        view
        returns (address[] memory)
    {
        return project[_id].processContracts;
    }

    function getAllProjects()
        external
        view
        hasRole('project:readAll')
        returns (uint256[] memory)
    {
        return projectsArray;
    }

    function getProcessesByAddress(address _address)
        external
        view
        hasRole('process:read')
        returns (address[] memory)
    {
        return (processesByAddress[_address]);
    }

    function getProjectsByAddress(address _address)
        external
        view
        hasRole('project:read')
        returns (uint256[] memory)
    {
        return (projectsByAddress[_address]);
    }

    function getProjectDetails(uint256 _id)
        external
        view
        hasRole('project:read')
        returns (State, address, bytes32, bytes32, address[] memory)
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
