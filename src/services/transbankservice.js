const { WebpayPlus, Options, Environment } = require('transbank-sdk');

const options = new Options(
  '597055555532',
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  Environment.Integration
);

exports.createTransaction = async ({ buyOrder, sessionId, amount, returnUrl }) => {
  const transaction = new WebpayPlus.Transaction(options);
  const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);
  return {
    url: response.url,
    token: response.token
  };
};

exports.commitTransaction = async (token) => {
  const transaction = new WebpayPlus.Transaction(options);
  return await transaction.commit(token);
};
