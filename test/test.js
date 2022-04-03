const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SipherSwapper", async function () {
    it("Should create a swap", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const SipherSwaper = await ethers.getContractFactory("SipherSwapper")
        const sipherSwaper = await SipherSwaper.deploy()
        await sipherSwaper.deployed()
        await sipherSwaper.connect(addr1).createSwap(addr2.address)
        const swap = await sipherSwaper.swaps(0)
        expect(swap.initiator).to.equal(addr1.address)
        expect(swap.partner).to.equal(addr2.address)

    }),
    it("Should create a swap and then a transfer that swap", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const SipherSwaper = await ethers.getContractFactory("SipherSwapper")
        const sipherSwaper = await SipherSwaper.deploy()
        await sipherSwaper.deployed()
        await sipherSwaper.connect(addr1).createSwap(addr2.address)
        const swaps = await sipherSwaper.swaps(0)
        expect(swaps.initiator).to.equal(addr1.address)
        expect(swaps.partner).to.equal(addr2.address)

        await sipherSwaper.connect(addr1).addTransferToSwap(0, owner.address, 1, 1)

        const transfersForSwap = await sipherSwaper.showTransfersForSwap(0)
        expect(transfersForSwap.length).to.equal(1)
        expect(transfersForSwap[0].from).to.equal(addr1.address)
    }),
        it("Should create a swap and then approve this swap", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();
            const SipherSwaper = await ethers.getContractFactory("SipherSwapper")
            const sipherSwaper = await SipherSwaper.deploy()
            await sipherSwaper.deployed()
            await sipherSwaper.connect(addr1).createSwap(addr2.address)
            const swaps = await sipherSwaper.swaps(0)
            expect(swaps.initiator).to.equal(addr1.address)
            expect(swaps.partner).to.equal(addr2.address)

            await sipherSwaper.connect(addr1).approveSwap(0)

            const swap = await sipherSwaper.swaps(0)
            expect(swap.initiatorApproved).to.equal(true)
            expect(swap.partnerApproved).to.equal(false)

            await sipherSwaper.connect(addr2).approveSwap(0)
            const swap_later = await sipherSwaper.swaps(0)
            expect(swap_later.initiatorApproved).to.equal(true)
            expect(swap_later.partnerApproved).to.equal(true)

        })

        ,
        it("Full test including testErc1155", async function () {
            //Preparation
            const [owner, addr1, addr2] = await ethers.getSigners();
            const SipherSwaper = await ethers.getContractFactory("SipherSwapper")
            const sipherSwaper = await SipherSwaper.deploy()

            const TestERC1155 = await ethers.getContractFactory("TestERC1155")
            const testErc1155 = await TestERC1155.deploy("Test", "test")

            await testErc1155.mintInu(addr1.address)
            await testErc1155.mintNeko(addr2.address)


            let wallet1InuCount = await testErc1155.balanceOf(addr1.address, 1)
            let wallet1NekoCount = await testErc1155.balanceOf(addr1.address, 2)
            expect(wallet1InuCount).to.equal(1)
            expect(wallet1NekoCount).to.equal(0)
            let wallet2InuCount = await testErc1155.balanceOf(addr2.address, 1)
            let wallet2NekoCount = await testErc1155.balanceOf(addr2.address, 2)
            expect(wallet2InuCount).to.equal(0)
            expect(wallet2NekoCount).to.equal(1)


            await sipherSwaper.deployed()

            //preparation end

            //Create a swap - in a real life scenario the ID of the swap has to be fetched from the event
            await sipherSwaper.connect(addr1).createSwap(addr2.address)
            const swaps = await sipherSwaper.swaps(0)
            expect(swaps.initiator).to.equal(addr1.address)
            expect(swaps.partner).to.equal(addr2.address)

            //Adding Transfers - from is always msg.sender and to is the other party of the swap
            await sipherSwaper.connect(addr1).addTransferToSwap(0, testErc1155.address, 1, 1)
            await sipherSwaper.connect(addr2).addTransferToSwap(0,  testErc1155.address, 2, 1)


            //Before both parties have approved the swap the execution is not possible and the executeSwap Call will revert
            await expect(sipherSwaper.connect(addr1).executeSwap(0)).to.be.revertedWith('Swap needs to be approved by both parties')
            await sipherSwaper.connect(addr1).approveSwap(0)
            //Before both parties have approved the swap the execution is not possible and the executeSwap Call will revert
            await expect(sipherSwaper.connect(addr1).executeSwap(0)).to.be.revertedWith('Swap needs to be approved by both parties')

            await sipherSwaper.connect(addr2).approveSwap(0)

            //Now both parties have approved the swap
            const swap = await sipherSwaper.swaps(0)
            expect(swap.initiatorApproved).to.equal(true)
            expect(swap.partnerApproved).to.equal(true)



            //As long as not bothe parties have authorized the swaper contract to move their assets, the transaction should fail
            await expect(sipherSwaper.connect(addr1).executeSwap(0)).to.be.revertedWith('ERC1155: caller is not owner nor approved')
            testErc1155.connect(addr1).setApprovalForAll(sipherSwaper.address, true)
            await expect(sipherSwaper.connect(addr1).executeSwap(0)).to.be.revertedWith('ERC1155: caller is not owner nor approved')
            testErc1155.connect(addr2).setApprovalForAll(sipherSwaper.address, true)

            //now both parties have authorized the swaper contract and the transfers will go through
            await sipherSwaper.connect(addr1).executeSwap(0)

            wallet1InuCount = await testErc1155.balanceOf(addr1.address, 1)
            wallet1NekoCount = await testErc1155.balanceOf(addr1.address, 2)
            expect(wallet1InuCount).to.equal(0)
            expect(wallet1NekoCount).to.equal(1)

            wallet2InuCount = await testErc1155.balanceOf(addr2.address, 1)
            wallet2NekoCount = await testErc1155.balanceOf(addr2.address, 2)
            expect(wallet2InuCount).to.equal(1)
            expect(wallet2NekoCount).to.equal(0)

        })
})