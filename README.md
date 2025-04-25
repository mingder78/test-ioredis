# test-ioredis

## references

* https://adzejs.com/reference/modifiers.html#withemoji

* https://www.npmjs.com/package/ioredis

* https://brew.sh

## features

* logger (adze)
* redis client (ioredis)


# build and run

To install dependencies:

```bash
bun install
```

To start your redis server locally

* install home brew on mac os

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

* install server on mac os

```sh
brew tap redis/redis
brew install --cask redis
```

* start server

```sh
bun server
```

To run:

```bash
bun run index.ts
```
or

```sh
bun dev
```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


## you can use redis from bun too

https://bun.sh/docs/api/redis

