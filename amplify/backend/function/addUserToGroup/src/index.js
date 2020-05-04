exports.handler = function afterConfirmationTrigger(event, context, callback) {
  const AWS = require('aws-sdk');
  const cognitoISP = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
  });

  const params = {
    GroupName: 'Users',
    UserPoolId: event.userPoolId,
    Username: event.userName
  };

  cognitoISP
    .adminAddUserToGroup(params)
    .promise()
    .then(() => callback(null, event))
    .catch(err => callback(err, event));
};