const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`FitQuest API running on port ${config.port}`);
});
