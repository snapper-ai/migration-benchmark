import "@testing-library/jest-dom";

// Recharts uses ResizeObserver via ResponsiveContainer; jsdom doesn't provide it.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverMock;


