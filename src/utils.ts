import adze, { setup } from 'adze';

// Enable log caching and raise the maximum cache size from the default of 300 to 500.
setup({
  cache: true,
  cacheSize: 500,
});

const logger = adze.withEmoji.timestamp.seal();

function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

export { sleep, logger };
