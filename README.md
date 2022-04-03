---This contract has not been audited - make sure to check whether everything fits your needs before using it ---

Usage of ERC1155Swapper:

1.) Create a swap using createSwap(address _swap_partner):
A swap can be only between two parties with this contract.
The ID of the Swap has to be fetched from the event SwapCreated(uint256 id, address initiator, address partner).

2.) Adding Transfers using addTransferToSwap(uint _swap_id, address  _contract_address, uint256 _token_id, uint256 _amount):
You have to reference the id of the Swap the transfer should be added to.
Only members of this swap are allowed to add transfers to a swap.
The msg.sender is always the "from" of the transaction and the other party is the "to" - so this does not need to be specified.
_contract_address has to reference the contract of the ERC1155 token to swap and the _token_id is the id of the token on this contract.
Amount specifies how many of those tokens should be transferred. If the participant of the swap do not own the specified tokens, the swap will fail.

3.) Both parties need to approve the Swap by using approveSwap(uint256 _id) with the ID of the swap.
This method can only be called when the msg.sender is one of the participating parties in the swap

4.) Both parties have to authorize the ERC1155Swapper contract with the setApprovalForAll(address swappercontract, true) method of all the ERC1155 contracts that are included in the swap

5.)Execute the swap by calling executeSwap(uint256 _id) with the ID of the swap. Only the involved parties can execute this call

This process is played through in ./test/test.js, test case "Full test including testErc1155"

TestERC1155.sol only serves the purpose of enabling a test case to actually move ERC1155 tokens.
