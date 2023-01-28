### 🪞 [Mirror](https://mirror-data.github.io)
Mirror: Plug-and-Play Data Query, Summarization and Visualization with Natural Language Interface




### Development
we used [next.js](https://nextjs.org) for full-stack development.

```bash
# Install dependencies
yarn install
# Set environment variables, more examples in .env.local.example
cp .env.local.example .env.local
# Run development server
yarn dev
```

### Deployment

build static files

```bash
# Build
yarn build
```

build docker image

```bash
# Build docker image
docker build -t mirror-data/mirror .
# multi arch build
docker buildx build --platform linux/amd64,linux/arm64 -t mirror-data/mirror .
```
