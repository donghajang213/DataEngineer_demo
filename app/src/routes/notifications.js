const express = require('express');
const router = express.Router();
const { sendPush } = require('../fcmService');

router.post('/', async (req, res, next) => {
  try {
    const { tokens, title, body, data } = req.body;
    const result = await sendPush(tokens, { title, body, data });
    res.json({
      success: result.successCount,
      failure: result.failureCount,
      responses: result.responses,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
