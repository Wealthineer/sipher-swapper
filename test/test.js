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

        await sipherSwaper.connect(addr1).addTransferToSwap(0, addr2.address, owner.address, 1, 1)

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
})