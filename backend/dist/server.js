import { createApp } from './app.js';
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('A variável PORT deve ser um número entre 1 e 65535.');
}
const server = createApp().listen(port, host, () => {
    console.log(`DevFlow AI API disponível em http://${host}:${port}`);
});
function shutdown() {
    server.close((error) => {
        if (error) {
            console.error('Falha ao encerrar o servidor da API.');
            process.exitCode = 1;
        }
    });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
