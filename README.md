# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


//
To build the Docker image, navigate to the project's root directory in your terminal and run the following command:

```bash
docker build -t videovision-app .
```

This command will build the Docker image and tag it as `videovision-app`.

o run the Docker container, use the following command:

```bash
docker run -p 3000:3000 videovision-app
```

This command will start the container and map port 3000 of the host to port 3000 of the container. You can then access the application in your browser at `http://localhost:3000`.