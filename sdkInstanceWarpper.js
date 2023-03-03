/**
 * @param {string} appid - app id ("PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126")
 * @param {object} sdk - sdk instance for mobile app (null for web)
 */
class nielsenSdkWarpper {
  // appSDK is null for web
  constructor(appid, sdk) {
    this.appid = appid;
    this.nSdkInstance = null;
    this.isAppPlay = false;
    
    // web
    if (sdk.nlsQ) {
      this.isApp = false;
      this.nSdkInstance = sdk.nlsQ(appid, "sdkInstance");
      // mobile app
    } else {
      this.isApp = true;
      this.nSdkInstance = sdk;
    }
  }

  call(name, data = null) {
    if (this.isApp) {
      // call play first time for app
      if (!this.isAppPlay) {
        if (name === "loadMetadata") {
          this.isAppPlay = true;
          this.nSdkInstance.play({ channelName: data.title });
        }
      }
      this.nSdkInstance[name](data);
    } else {
      this.nSdkInstance.ggPM(name, data);
    }
  }
}

module.exports = nielsenSdkWarpper;
