import { defineConfig } from 'vite'

export default defineConfig({
    // index.html and script.js live in src/ (same layout the old webpack config used)
    root: 'src',
    // Files in static/ are copied as-is to the build root (was copy-webpack-plugin)
    publicDir: '../static',
    server: {
        host: true,
        open: true
    },
    build: {
        // Keep the old webpack output directory so the Vercel settings keep working
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        // three.js alone is ~550 kB minified
        chunkSizeWarningLimit: 1000
    }
})
