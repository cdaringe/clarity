export const withRafDebounce = <T extends (...args: any[]) => void>(fn: T) => {
  let isBusy = false;
  return function attemptDebouncedRaf(...args: Parameters<T>) {
    if (isBusy) {
      return;
    }
    isBusy = true;
    window.requestAnimationFrame(function applyDebouncedRafFn() {
      try {
        fn(args);
      } finally {
        isBusy = false;
      }
    });
  };
};
