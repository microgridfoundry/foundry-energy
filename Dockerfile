FROM denoland/deno:2.9.7

WORKDIR /app

# Install dependencies exactly as pinned in deno.lock (cached layer)
COPY deno.json deno.lock ./
RUN deno install --frozen

# Copy source and build the Fresh app for production.
# static/ must stay in the image: images are served from it at runtime.
COPY . .
RUN deno task build

ENV PORT=8000
EXPOSE 8000

CMD ["serve", "-A", "--port=8000", "_fresh/server.js"]
