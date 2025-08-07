const { WebpayPlus, Options, Environment } = require('transbank-sdk');

const options = new Options(
  process.env.TBK_COMMERCE_CODE,
  process.env.TBK_API_KEY,
  Environment.Production
);

exports.createTransaction = async ({ buyOrder, sessionId, amount, returnUrl }) => {
  const transaction = new WebpayPlus.Transaction(options);
  const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);
  return {
    url: response.url,
    token: response.token,
    buyOrder,
    sessionId,
    amount
  };
};

exports.commitTransaction = async (token) => {
  const transaction = new WebpayPlus.Transaction(options);
  return await transaction.commit(token);
};
