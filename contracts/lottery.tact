import "@stdlib/deploy";

message EchoContract {
    original_sender: Address;
}

contract Lottery with Deployable {
    // min coins to store this contract in blockchain and to pay for gas for safe bet
    const MinTonForStorage: Int = ton("0.3");
    const MinSafeBet: Int = ton("0.1");
    // echo contract in masterchain
    const echo_contract: String = "Ef-z--k3eVXf1UGE2YO0hArWaC8bMEs9uWc-PJ95DSHeRM_5";
    //address();

    owner: Address;
    id: Int as uint32;
    draw_counter: Int as uint32;
    win_counter: Int as uint32;
    recent_draw_win: Bool;
    recent_draw_safe: Bool;

    init(id: Int) {
        self.owner = sender();
        self.id = id;
        self.draw_counter = 0;
        self.win_counter = 0;
        self.recent_draw_win = false;
        self.recent_draw_safe = false;
    }

   receive("donation") {

    }

   receive("bet") {
        
        let balance_after_win: Int = myBalance() - 2 * context().value - self.MinTonForStorage;

        require(balance_after_win >= 0, "Sorry mate, don't have enough coins to play");

        self.draw_counter += 1;
        self.recent_draw_safe = false;

        if (self.randomizer() == 1){    
            send(SendParameters{
                    to: sender(),
                    bounce: true,
                    value: 2 * context().value,
                    mode: SendIgnoreErrors,
                    body: "Bingo!".asComment()
                });
            self.win_counter += 1;
            self.recent_draw_win = true;
        }
        else{
            self.recent_draw_win = false;
        }
        }

   receive("safe bet") {

        require(context().value >= self.MinSafeBet, "Sorry mate, bet is too small for the safe mode");

        let balance_after_win: Int = myBalance() - 2 * context().value - self.MinTonForStorage;

        require(balance_after_win >= 0, "Sorry mate, don't have enough coins to play");

        let echo_address: Address = address(self.echo_contract);

        self.draw_counter += 1;
        self.recent_draw_safe = true;

        send(SendParameters{
                    to: echo_address,
                    bounce: true,
                    value: 2 * context().value,
                    mode: SendIgnoreErrors,
                    body: EchoContract{original_sender: sender()}.toCell()
                });

        }

   receive(msg: EchoContract) {
        let echo_address: Address = address(self.echo_contract);
        
        require(sender() == echo_address, "Sender should be an echo contract");
        let original_sender: Address = msg.original_sender;

        if (self.randomizer() == 1){    
            send(SendParameters{
                    to: original_sender,
                    bounce: true,
                    value: context().value,
                    mode: SendIgnoreErrors,
                    body: "Bingo!".asComment()
                });
            self.win_counter += 1;
            self.recent_draw_win = true;
        }
        else{
            self.recent_draw_win = false;
        }
        }

    fun randomizer(): Int {
        nativeRandomizeLt(); 
        let rand: Int = random(0, 2);
        return rand;
    }  

    get fun draw_counter(): Int {
        return self.draw_counter;
    }

    get fun win_counter(): Int {
        return self.win_counter;
    }

    get fun recent_draw(): Bool {
        return self.recent_draw_win;
    }

    get fun recent_draw_safe(): Bool {
        return self.recent_draw_safe;
    }

    get fun id(): Int {
        return self.id;
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }    
    
}
