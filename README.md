# Crypto Jackpot

A slot machine game built with PixiJS and Vite.

## Rendering

The renderer prefers WebGPU and falls back to WebGL when WebGPU is unavailable. PixiJS can use its Canvas renderer as a final compatibility fallback when GPU rendering is unavailable. GPU contexts request a high-performance adapter, and rendering resolution is capped at 2x the device pixel ratio.

Reel blur filters are enabled only while spinning to avoid unnecessary filter passes while idle.

## Gameplay

After each completed main spin, one of the five reel buttons can be used once. All five buttons remain unavailable until the next completed main spin.

## Development

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and run the linter with `npm run lint`.
