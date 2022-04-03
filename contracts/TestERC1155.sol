//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TestERC1155 is ERC1155, AccessControl{
    uint256 public constant INU = 1;
    uint256 public constant NEKO = 2;

    bytes32 public constant ADMIN = keccak256("ADMIN");

    string private _baseMetadataUri;
    string public name;
    string public symbol;

    bool private _transferEnabled = true;

    constructor(string memory _name, string memory _symbol) ERC1155(""){
        _grantRole(ADMIN, msg.sender);
        setBaseMetadataURI("ipfs://123/");

        name  = _name;
        symbol = _symbol;
    }

    function uri(uint256 _id) public view virtual override returns (string memory) {
        return string(abi.encodePacked(
            _baseMetadataUri,
            Strings.toString(_id)
        ));
    }

    function setBaseMetadataURI (
        string memory _newBaseMetadataURI
    ) public onlyRole(ADMIN) {
        _baseMetadataUri = _newBaseMetadataURI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual override {
        require(_transferEnabled);
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public virtual override {
        require(_transferEnabled);
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

//    Cannot be reverted - once transfer is enabled it cannot be disabled again
    function enableTransfer() public onlyRole(ADMIN){
        _transferEnabled = true;
    }

    function mintInu(address _to) public {
        _mint(_to, INU, 1, "");
    }

    function mintNeko(address _to) public {
        _mint(_to, NEKO, 1, "");
    }

    function mint(address _to, uint256 _id) public  onlyRole(ADMIN){
        _mint(_to, _id, 1, "");
    }

    function grantRole(bytes32 _role, address _account) public virtual override onlyRole(ADMIN) {
        _grantRole(_role, _account);
    }





}

