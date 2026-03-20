import express from 'express';
import fs from 'fs'

const app = express();

app.use(express.json());

app.get('/counter/:bookId', (req, res, next) => {
    try {
        const { bookId } = req.params;
        fs.readFile('./data/countOfviews.json', (err, data) => {
            let viewsData = {};
            if (data) {
                viewsData = JSON.parse(data);
            }
            if (!viewsData[bookId]) {
                res.send(0)
            } else {
                res.send(viewsData[bookId])
            }
        })

    } catch (error) {
        next(error)
    }
});

app.post('/counter/:bookId/incr', (req, res, next) => {
    const { bookId } = req.params;
    const filePath = './data/countOfviews.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        let viewsData = {};
        if (err) {
            if (err.code === 'ENOENT') {
                viewsData = {};
            } else {
                return next(err);
            }
        } else {
            try {
                if (data && data.trim()) {
                    viewsData = JSON.parse(data);
                } else {
                    viewsData = {};
                }
            } catch (parseErr) {
                return next(new Error('Invalid JSON in countOfviews.json'));
            }
        }
        
        // Обновляем счетчик
        if (!viewsData[bookId]) {
            viewsData[bookId] = 1;
        } else {
            viewsData[bookId] += 1;
        }
        
        // Сохраняем обратно в файл
        fs.writeFile(filePath, JSON.stringify(viewsData, null, 2), (writeErr) => {
            if (writeErr) {
                return next(writeErr);
            }
            res.send(viewsData[bookId]);
        });
    });
});

app.listen(3001, () => {
  console.log('Cервис запущен на порту: 3001');
});