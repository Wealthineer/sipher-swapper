//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SipherSwapper{
    using Counters for Counters.Counter;

//struct defining a swap and a transfer etc
    mapping(uint256 => Swap) public swaps;
    mapping(uint256 => Transfer[]) public transfers;

    Counters.Counter current_id;

    struct Swap {
        uint256 id;
        address initiator;
        address partner;
//        mapping(uint256 => Transfer) transfers;
        bool initiatorApproved;
        bool partnerApproved;
        bool executed;
    }

    struct Transfer {
        address from;
        address to;
        address contract_address;
        uint256 id;
        uint256 amount;
    }

    event SwapCreated(uint256 id, address initiator, address partner);
    event TransferCreated(uint256 swap_id, address to, address from, address contract_address, uint256 token_id, uint256 amount);
    event SwapApproved(uint256 id, address approver);
    event SwapExecuted(uint256 id);

    //function creating a swap - including two people
    function createSwap(address _swap_partner) public returns(uint256 id) {
        Swap memory swap;
        swap.initiator = msg.sender;
        swap.partner = _swap_partner;
        swap.id = current_id.current();
        current_id.increment();
        swaps[swap.id] = swap;
        emit SwapCreated(swap.id, swap.initiator, swap.partner);

        return swap.id;
    }

    //function adding transfers to a swap - check that only people listed as parties can add transactions
    function addTransferToSwap(uint _swap_id, address _to, address  _contract_address, uint256 _token_id, uint256 _amount) public {
        require(swaps[_swap_id].initiator != address(0x0));
        Swap memory swap = swaps[_swap_id];
        require(msg.sender == swap.initiator || msg.sender == swap.partner);
        Transfer memory transfer = Transfer(msg.sender, _to, _contract_address, _token_id, _amount);
        transfers[_swap_id][transfers[_swap_id].length] = transfer;
        emit TransferCreated(_swap_id, transfer.to, transfer.from, transfer.contract_address, transfer.id, transfer.amount);
    }

    //function showing the transfers the other party has entered (or just all
    function showTransfersForSwap(uint256 _id) public view returns(Transfer[] memory swapTransfers) {
        require(swaps[_id].initiator != address(0x0));
        Transfer[] memory returnTransfers = transfers[_id];
        return returnTransfers;
    }

    //function approving a swap
    function approveSwap(uint256 _id) public {
        require(swaps[_id].initiator != address(0x0));
        Swap storage swap = swaps[_id];
        require(msg.sender == swap.initiator || msg.sender ==  swap.partner);
        if(msg.sender == swap.initiator) {
            swap.initiatorApproved = true;
        emit SwapApproved(_id, msg.sender);
        } else if (msg.sender == swap.partner) {
            swap.partnerApproved = true;
            emit SwapApproved(_id, msg.sender);
        }

    }

    //function executing a swap
    function executeSwap(uint256 _id) public {
        require(swaps[_id].initiator != address(0x0));
        Swap storage swap = swaps[_id];
        require(swap.partnerApproved && swap.initiatorApproved);
        Transfer[] memory swapTransfers = transfers[_id];
        for(uint256 i = 0; i < swapTransfers.length; i++) {
            ERC1155 nftContract = ERC1155(swapTransfers[i].contract_address);
            nftContract.safeTransferFrom(swapTransfers[i].from, swapTransfers[i].to, swapTransfers[i].id, swapTransfers[i].amount, "");
        }
        swap.executed = true;
        emit SwapExecuted(_id);
    }

}
