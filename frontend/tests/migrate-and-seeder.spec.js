import { test } from '@hyvor/laravel-playwright';

test('migrate', async ({ laravel }) => {
    await laravel.artisan('migrate:fresh', {
        '--env': 'testing',
        '--database': 'testing'
    });
    
    await laravel.artisan('db:seed', {
        '--env': 'testing',
        '--database': 'testing'
    });
});