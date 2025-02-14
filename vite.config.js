import { defineConfig } from 'vite';
import path from 'path';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

const rootPath = './';

export default defineConfig({
  build: {
    // Минификация css в build версии
    minify: true,
    assetsDir: './assets/',
    outDir: './dist',
    // Обработка всех страниц в папке page
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map((file) => [
            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ])
      )
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
      }
    }),
    {
      ...imagemin(['./src/images/**/*.{jpg,png,jpeg}'], {
        destination: './src/images/webp/',
        plugins: [imageminWebp({ quality: 100 })]
      }),
      apply: 'serve'
    }
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // Автодобавление в каждый файл scss формата строки
        additionalData: `@use '@/styles/helpers' as *;`,
        // Игнорирование предупреждения
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
