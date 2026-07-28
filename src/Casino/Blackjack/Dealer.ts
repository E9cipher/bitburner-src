import { Hand } from "./Hand";

/**
 * Defines the dealer
 */
export class Dealer {
    constructor (
        public hand: Hand = new Hand()
    ) {}
    /**
     * Whether the dealer should hit or not
     * @returns true if the hand value is greater than 17, false otherwise
     */
    shouldHit(): boolean {
        return this.hand.value <= 17;
    }
}