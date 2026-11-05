FROM denoland/deno:2.4.4

WORKDIR /app

# Copy source code
COPY . .

# Cache all dependencies including routes and components
RUN deno cache --reload main.ts dev.ts routes/*.tsx components/*.tsx

# Build the Fresh app for production
RUN deno run -A dev.ts build

# The port that your application listens to
ENV PORT=8000

EXPOSE 8000

# Run the built app with deno serve
CMD ["serve", "-A", "--port=8000", "_fresh/server.js"]