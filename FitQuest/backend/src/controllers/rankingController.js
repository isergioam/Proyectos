const rankingService = require('../services/rankingService');

const getRanking = async (req, res, next) => {
  try {
    const ranking = await rankingService.getRanking(req.params.id);
    res.json({ success: true, data: ranking });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRanking };
