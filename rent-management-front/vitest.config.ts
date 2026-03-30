import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                rootDir: '.',
            }
        },
        include: ['app/**/*.{test,spec}.{ts,js}'],
    }
})