import { defineConfig } from 'vite';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import glob from 'fast-glob';

const root = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'dist');
const htmlFiles = glob.sync('**/*.html', { cwd: root, ignore: ['**/node_modules/**', '**/_*'] });

export default defineConfig({
  root,
  base: './',

  build: {
    outDir,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: htmlFiles.reduce(
        (acc, file) => ({
          ...acc,
          [file.replace(path.extname(file), '')]: path.resolve(root, file)
        }),
        {}
      ),

      output: {
        assetFileNames: ({ name }) => {
          name = name.toLowerCase();

          if (/\.(png|jpe?g|svg|gif|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2)$/.test(name ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
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
  }
});
