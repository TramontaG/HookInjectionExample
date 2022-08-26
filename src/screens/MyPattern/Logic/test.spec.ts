import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../Logic';

describe("SampleTest", () => {
    const getFreshCounter = () => renderHook(useCounter);

    it("should start with 0", () => {
        const counter = getFreshCounter();
        expect(counter.result.current.value).toBe(0);
    });

    it("should increment value", async () => {
        const counter = getFreshCounter();

        act(() => {
            counter.result.current.increment();
        })

        expect(counter.result.current.value).toBe(1);
    });

    it ("should not get to 10", () => {
        const counter = getFreshCounter();

        for (let i = 0; i < 15; i++){
            act(() => {
                counter.result.current.increment();
            });

            expect(counter.result.current.value).toBeLessThan(10);
        }
    });

    it ("should be able to go negative", () => {
        const counter = getFreshCounter();

        act(() => {
            counter.result.current.decrement();
        });

        expect(counter.result.current.value).toBeLessThan(0);
    });

    it ("should be able to tell if a number is odd or even", () => {
        const counter = getFreshCounter();

        for (let i = 0; i < 15; i++){
            act(() => {
                counter.result.current.increment();
            });

            expect(counter.result.current.isEven).toBe(counter.result.current.value % 2 === 0);
            expect(counter.result.current.isOdd).toBe(counter.result.current.value % 2 === 1);
        }
    });
})
