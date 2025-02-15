import { defineConfig } from 'vite';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';

const rootPath = './';

export default defineConfig({
  build: {
    minify: true,
    assetsDir: './assets/',
    outDir: './dist',
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map((file) => [
            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ])
      ),
      output: {
        assetFileNames: ({ name }) => {
          if (name && /\.(png|jpe?g|svg|gif|webp)$/.test(name)) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (name && /\.(woff2)$/.test(name)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: path.resolve('src') + '/'
      }
    ]
  },
  plugins: [
    ViteImageOptimizer({
      optimizeImages: true,
      svg: {
        plugins: ['removeDoctype', 'removeXMLProcInst', 'minifyStyles', 'sortAttrs', 'sortDefsChildren']
      },
      png: {
        quality: 100
      },
      jpeg: {
        quality: 100
      },
      jpg: {
        quality: 100
      },
      webp: {
        quality: 100
      },
      avif: {
        quality: 100
      }
    })
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/styles/helpers' as *;`,
        silenceDeprecations: ['legacy-js-api']
      },
      less: {},
      stylus: {}
    }
  },
  markdown: {
    useRemarkGfm: true,
    useRehypeHighlight: true,
    remarkGfmOptions: {},
    rehypeHighlightOptions: {},
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: []
    }
  },
  base: `${rootPath}`
});
