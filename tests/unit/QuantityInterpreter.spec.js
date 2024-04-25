/* eslint-disable */
import QuantityInterpreter from "@/QuantityInterpreter";

describe('QuantityInterpreter', () => {
    it("returns quantity", async () => {
        expect(
            QuantityInterpreter.getQty(
                "25.00 kg"
            )
        ).toBe(25.00);
    });
    it("returns format", async () => {
        expect(
            QuantityInterpreter.getFormat(
                "25.01 kg"
            )
        ).toBe("kg");
    });
    it("accepts quantity with no decimals", async () => {
        expect(
            QuantityInterpreter.getQty(
                "25 kg"
            )
        ).toBe(25);
    });
    it("can take decimals", async () => {
        expect(
            QuantityInterpreter.getQty(
                "25.52 kg"
            )
        ).toBe(25.52);
    })
    it("works with spaces around", async () => {
        expect(
            QuantityInterpreter.getQty(
                " 25.52 kg"
            )
        ).toBe(25.52);
        expect(
            QuantityInterpreter.getQty(
                " 25.52 kg "
            )
        ).toBe(25.52);
        expect(
            QuantityInterpreter.getQty(
                " 25.52 kg "
            )
        ).toBe(25.52);
    });
    it("works with commas", async () => {
        expect(
            QuantityInterpreter.getQty(
                "25,52kg"
            )
        ).toBe(25.52);
    });
    it("converts decimal to fraction", async () => {
        expect(
            QuantityInterpreter.convertDecimalToFraction(
                0.25,
                {
                    format: "12 kg",
                    qtyInBox: 1
                }
            )
        ).toBe(3);
    });
    // it('validates format where', () => {
    //
    // })
});
