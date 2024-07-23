import { Address, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const lottery = provider.open(await Lottery.fromInit(7163n));

    const draws = await lottery.getDrawCounter();
    const wins = await lottery.getWinCounter();
    const recent_draw = await lottery.getRecentDraw();
    const recent_draw_safe = await lottery.getRecentDraw();

    ui.write('Draws: ');
    ui.write(draws.toString());

    ui.write('Wins: ');
    ui.write(wins.toString());

    ui.write('Recent draw = win: ');
    ui.write(recent_draw.toString());

    ui.write('Recent draw = safe: ');
    ui.write(recent_draw_safe.toString());

}