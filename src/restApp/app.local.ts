import { app } from './app';

const port = Number(process.env.NODE_LOCAL_PORT) || 3000;

app.listen(port, (): void => {
	// eslint-disable-next-line no-console
	console.log(`server started at http://localhost:${port}`);
});
