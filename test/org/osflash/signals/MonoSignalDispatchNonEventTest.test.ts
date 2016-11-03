import { assert } from "chai";

import { AsyncUtil } from "../../../util/AsyncUtil";
import { MonoSignal } from "../../../../src/org/osflash/signals/MonoSignal";

describe("MonoSignalDispatchNonEventTest", () => {

    let async: AsyncUtil = new AsyncUtil();

    let completed: MonoSignal;

    beforeEach(() => {
        completed = new MonoSignal(Date);
    });

    afterEach(() => {
        completed.removeAll();
        completed = null;
    });

    /**
     * Captures bug where dispatching 0 was considered null.
     */
    it("dispatch_zero_should_call_listener_with_zero()", (done) => {
        completed = new MonoSignal(Number);
        completed.add(async.add(onZero, 10, done));
        completed.dispatch(0);
    });

    function onZero(num: number): void {
        assert.equal(0, num);
    }

    it("dispatch_2_zeroes_should_call_listener_with_2_zeroes()", (done) => {
        completed = new MonoSignal(Number, Number);
        completed.add(async.add(onZeroZero, 10, done));
        completed.dispatch(0, 0);
    });

    function onZeroZero(a: Object, b: Object): void {
        assert.equal(0, a);
        assert.equal(0, b);
    }

    it("dispatch_null_should_call_listener_with_null()", (done) => {
        completed.addOnce(async.add(checkNullDate, 10, done));
        completed.dispatch(null);
    });

    function checkNullDate(date: Date): void {
        assert.isNull(date);
    }

    // TODO: skipped because it checks as3 specific functionality
    it.skip("dispatch_null_through_int_Signal_should_be_autoconverted_to_zero()", (done) => {
        completed = new MonoSignal(Number);
        completed.addOnce(async.add(checkNullConvertedToZero, 10, done));
        completed.dispatch(null);
    });

    function checkNullConvertedToZero(intValue: number): void {
        assert.equal(0, intValue, "null was converted to 0");
    }
});
