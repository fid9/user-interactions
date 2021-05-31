import express from 'express';
import accountRoutes from './routes/account.routes';
import interactionRoutes from './routes/interaction.routes';

const app = express();

app.use('account-api', accountRoutes);
app.use('interaction-api', interactionRoutes);