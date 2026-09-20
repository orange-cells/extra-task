export default (express, zlib, busboy) => {
    const app = express();

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers',
            'Content-Type, Accept, ngrok-skip-browser-warning, \
            Authorization, x-test, Access-Control-Allow-Headers');
        next();
    });

    app.get('/login/', (req, res) => {
        res.send('orangecells_1');
    });
    
    const gzipAsync = (buf) =>
        new Promise((resolve, reject) => {
            zlib.gzip(buf, (err, res) => (err ? reject(err) : resolve(res)));
    });

    app.post('/zipper/', (req, res) => {
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data')) {
            let fileBuffer = null;
            const bb = busboy({ headers: req.headers });

            bb.on('file', (_name, file) => {
                const chunks = [];
                file.on('data', (chunk) => chunks.push(chunk));
                file.on('end', () => {
                fileBuffer = Buffer.concat(chunks);
            });
        });

        bb.on('field', (_name, val) => {
            if (fileBuffer === null) {
                fileBuffer = Buffer.from(val);
            }
        });

        bb.on('finish', async () => {
            try {
                const data = fileBuffer ?? Buffer.from('');
                const compressed = await gzipAsync(data);
                res.setHeader('Content-Type', 'application/gzip');
                res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
                res.send(compressed);
            } catch (err) {
                res.status(500).send('orangecells_1');
            }
        });

        bb.on('error', () => {
            res.status(500).send('orangecells_1');
        });

        req.pipe(bb);
        return;
        }

        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
        try {
            const data = chunks.length > 0 ? Buffer.concat(chunks) : Buffer.from('');
            const compressed = await gzipAsync(data);
            res.setHeader('Content-Type', 'application/gzip');
            res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
            res.send(compressed);
        } catch (err) {
            res.status(500).send('orangecells_1');
        }
        });
        req.on('error', () => {
        res.status(500).send('orangecells_1');
        });
    });

    app.all('*', (req, res) => {
        res.send('orangecells_1');
    });

    return app;
};
