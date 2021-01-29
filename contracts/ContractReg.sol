// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract ContractReg {
    struct contStruct {
        uint256 id;
        string ownerName;
        address ownerAddress;
        string contDesc;
        uint256 contType;
        string startDate;
        string endDate;
        string municililaty;
        string imageHash;
    }

    uint256 public contractCounter;

    constructor() public {
        contractCounter = 0;
    }

    mapping(uint256 => contStruct) public contracts;

    function createContract(
        uint256 _id,
        string memory _ownerName,
        string memory _contDesc,
        uint256 _contType,
        string memory _startDate,
        string memory _endDate,
        string memory _municililaty,
        string memory _imageHash
    ) public {
        contractCounter++;
        contracts[contractCounter] = contStruct(
            _id,
            _ownerName,
            msg.sender,
            _contDesc,
            _contType,
            _startDate,
            _endDate,
            _municililaty,
            _imageHash
        );
    }

    function getContractByID(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            address 
        )
    {
        for (uint256 i = 1; i <= contractCounter; i++) {
            contStruct memory tempCont = contracts[i];
            if (tempCont.id == _id) {
                return (
                    tempCont.id,
                    tempCont.ownerName,
                    tempCont.contDesc,
                    tempCont.contType,
                    tempCont.startDate,
                    tempCont.endDate,
                    tempCont.imageHash,
                    tempCont.municililaty,
                    tempCont.ownerAddress
                );
            }
        }
    }
}
