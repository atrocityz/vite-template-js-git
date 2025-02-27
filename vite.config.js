import { defineConfig } from 'vite';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import glob from 'fast-glob';
import injectHTML from 'vite-plugin-html-inject';

/* Если нужно использовать спрайты, то достаточно раскомментировать импорт и вызов функции в plugins */
// import IconSpritePlugin from './plugins/vite-plugin-icon-sprite';

const root = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, 'dist');
const htmlFiles = glob.sync('**/*.html', { cwd: root, ignore: ['**/node_modules/**', '**/_*', '**/partials/*'] });

export default defineConfig({
  root,
  base: './',
  publicDir: 'resources',

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
        quality: 80
      },
      jpeg: {
        quality: 80
      },
      jpg: {
        quality: 80
      },
      webp: {
        quality: 80
      },
      avif: {
        quality: 80
      }
    }),
    injectHTML()
    // IconSpritePlugin()
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
