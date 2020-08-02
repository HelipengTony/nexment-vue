// LeanCloud storage initiation
const AV = require('leancloud-storage');

// To avoid reinitialization
var initCount = 0;
const leanCloud = (appId: string, appKey: string, serverURL: string) => {
  if (initCount === 0) {
    AV.init({
      appId: appId,
      appKey: appKey,
      serverURL: serverURL,
    });
    initCount++;
  }
  return AV;
};

export default leanCloud;
