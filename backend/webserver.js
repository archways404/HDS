const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(
	cors({
		origin: '*',
		methods: 'GET',
	})
);

app.use(express.json());

const { initializeAndProcess } = require('./functions/Fetch');

app.get('/fetchdays', async (req, res) => {
	let days = await initializeAndProcess();
	res.send(days);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});