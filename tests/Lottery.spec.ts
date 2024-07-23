import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import '@ton/test-utils';

describe('Lottery', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lottery: SandboxContract<Lottery>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lottery = blockchain.openContract(await Lottery.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lottery.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and Lottery are ready to use
    });


    it('balance top up', async () => {
        
        let balance_before = await lottery.getBalance()
        console.log('Balance after donation: ', balance_before);

        const donation = await lottery.send(
            deployer.getSender(),
            {
                value: toNano('5'),
            },
            'donation'
        );

        expect(donation.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: true,
        });

        let balance_after = await lottery.getBalance()
        console.log('Balance after donation: ', balance_after);
        expect(parseFloat(balance_after)).toBeCloseTo(5);
    });

    it('bet > balance - min allowed balance', async () => {
        let balance_before = await lottery.getBalance()
        console.log('Balance before donation: ', balance_before);

        // top up
        const donation = await lottery.send(
            deployer.getSender(),
            {
                value: toNano('5'),
            },
            'donation'
        );

        expect(donation.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: true,
        });

        let balance_after = await lottery.getBalance()
        console.log('Balance before donation: ', balance_after);

        // bet > balance
        const big_bet = await lottery.send(
            deployer.getSender(),
            {
                value: toNano('10'),
            },
            'bet'
        );

        expect(big_bet.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: false,
        });

        // bet > balance - min storage fee
        let balance = await lottery.getBalance()
        console.log('Current balance: ', balance);

        const bet_equal_to_balance = await lottery.send(
            deployer.getSender(),
            {
                value: toNano(balance),
            },
            'bet'
        );

        expect(bet_equal_to_balance.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: false,
        });

        // bet > balance - min storage fee
        const normal_bet = await lottery.send(
            deployer.getSender(),
            {
                value: toNano("3"),
            },
            'bet'
        );

        expect(normal_bet.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: true,
        });

        balance = await lottery.getBalance()
        console.log('Balance after normal transaction: ', balance);

    });


    it('draws', async () => {
        // top up
        const donation = await lottery.send(
            deployer.getSender(),
            {
                value: toNano('20'),
            },
            'donation'
        );

        expect(donation.transactions).toHaveTransaction({
            from: deployer.address,
            to: lottery.address,
            success: true,
        });
        
        // draw
        const drawTimes = 10;
        const balanceBefore  = await lottery.getBalance();
        for (let i = 0; i < drawTimes; i++) {
            console.log(`Draw:  ${i + 1}/${drawTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const drawsBefore  = await lottery.getDrawCounter();
            const winsBefore  = await lottery.getWinCounter();
            

            const draw = await lottery.send(
                increaser.getSender(),
                {
                    value: toNano('1'),
                },
                'bet'
            );

            expect(draw.transactions).toHaveTransaction({
                from: increaser.address,
                to: lottery.address,
                success: true,
            });


            const drawsAfter  = await lottery.getDrawCounter();
            const winsAfter = await lottery.getWinCounter();
            const recentDraw  = await lottery.getRecentDraw();

            expect(drawsAfter).toBe(drawsBefore + 1n);
            if (recentDraw == true){
                expect(winsAfter).toBe(winsBefore + 1n);

            }
            else{
                expect(winsAfter).toBe(winsBefore);
            }
            
            console.log('wins:', winsAfter);
        }
        const balanceAfter  = await lottery.getBalance();
        const winsAfter = await lottery.getWinCounter();
        console.log(`Balance:`, balanceAfter);
        expect(parseFloat(balanceAfter)).toBeCloseTo(parseFloat(balanceBefore) + 10 - 2 * Number(winsAfter), 1);
    });
});
