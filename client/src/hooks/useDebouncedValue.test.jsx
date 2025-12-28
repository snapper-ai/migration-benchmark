import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue.js";

function Harness({ value, delay }) {
  const debounced = useDebouncedValue(value, delay);
  return (
    <React.Fragment>
      <div data-testid="v">{debounced}</div>
    </React.Fragment>
  );
}

describe("useDebouncedValue", () => {
  it("debounces updates", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<Harness value="a" delay={200} />);
    expect(screen.getByTestId("v")).toHaveTextContent("a");

    act(() => {
      rerender(<Harness value="b" delay={200} />);
    });
    expect(screen.getByTestId("v")).toHaveTextContent("a");

    await act(async () => {
      vi.advanceTimersByTime(199);
    });
    expect(screen.getByTestId("v")).toHaveTextContent("a");

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("v")).toHaveTextContent("b");
    vi.useRealTimers();
  });
});


