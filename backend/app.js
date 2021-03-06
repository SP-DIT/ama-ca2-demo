const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const Ama = require('./ama');
const ama = new Ama();

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.post('/sessions', function (req, res, next) {
    // create a session
    return ama.createSession().then((ids) => res.status(201).json(ids));
});

app.put('/sessions/:sessionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const ownerId = req.query.owner_id;
    const action = req.query.action;
    ama.updateSession(sessionId, ownerId, action);
    return res.send();
});

app.post('/sessions/:sessionId/questions', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const question = req.body.question;
    return ama
        .askQuestion(sessionId, question)
        .then((questionId) => res.status(201).json(questionId))
        .catch(next);
});

app.get('/sessions/:sessionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    return ama
        .getSession(sessionId)
        .then((session) => res.json(session))
        .catch(next);
});

app.get('/sessions/:sessionId/questions/:questionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const questionId = req.params.questionId;
    const question = ama
        .getQuestion(sessionId, questionId)
        .then((question) => res.json(question))
        .catch(next);
});

app.post('/sessions/:sessionId/questions/:questionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const questionId = req.params.questionId;
    const ownerId = req.query.owner_id;
    const answer = req.body.answer;
    return ama
        .answerQuestion(sessionId, ownerId, questionId, answer)
        .then(function () {
            res.status(201).send();
        })
        .catch(next);
});

app.post('/', function (req, res, next) {
    ama.setupTable()
        .then(function () {
            return res.status(201).send();
        })
        .catch(next);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404, `Resource ${req.method} ${req.originalUrl} not found`));
});

// error handler
app.use(function (err, req, res, next) {
    // For Debugging
    console.error(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(err.status || 500).json({ error: err.message || 'Unknown error!' });
});

module.exports = app;
