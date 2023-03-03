const nielsenSdk = require("./sdkInstanceWarpper");

/**
 * @param {string} type - video type (live, vod)
 * @param {{ id, title, program, duration }} videoDetail - video detail
 * @param {string} appid - app id
 * @param {mobileSDKInstance} appSDK - sdk instance for mobile app (null for web)
 */
class nielsenWarpper {
  constructor(
    type,
    videoDetail,
    appid = "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
    appSDK
  ) {
    this.videoType = type;
    this.currentPosition = 0;
    this.backupPosition = 0;
    this.metaObj = {
      assetid: type === "live" ? "thairath-live" : videoDetail.id,
      type: "content",
      isfullepisode: type === "live" ? "N" : "Y",
      program:
        type === "live"
          ? "thairath-live"
          : videoDetail.program || videoDetail.title,
      title: type === "live" ? "thairath-live" : videoDetail.title,
      length:
        type === "live" ? 86400 : this._convertDuration(videoDetail.duration),
      segB: type === "live" ? "xxxxx" : "yyyyy", // ไม่แน่ใจ
      segC: type === "live" ? "xxxxx" : "yyyyy", // ไม่แน่ใจ
      vcid: type === "live" ? "c01" : "c02", // ไม่แน่ใจ
    };
    this.adsObj = {
      assetid: null,
      type: null,
    };
    this.timeInterval = null;
    this.sdkInstance = new nielsenSdk(appid, appSDK);
    this.sdkInstance.call("loadMetadata", this.metaObj);
  }

  _convertDuration(duration) {
    if (duration.indexOf(":")) {
      const time = duration.split(":");
      if (time.length === 2) {
        return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
      } else if (time.length === 3) {
        return (
          parseInt(time[0], 10) * 3600 +
          parseInt(time[1], 10) * 60 +
          parseInt(time[2], 10)
        );
      }
    } else {
      return parseInt(duration, 0);
    }
  }

  startInterval(type) {
    const sdkInstance = this.sdkInstance;
    this.timeInterval = setInterval(() => {
      if (type === "ad" || this.videoType === "live") {
        sdkInstance.call("setPlayheadPosition", ++this.currentPosition);
      } else {
        sdkInstance.call(
          "setPlayheadPosition",
          parseInt(+new Date() / 1000, 0)
        );
      }
    }, 1000);
  }

  stopInterval() {
    clearInterval(this.timeInterval);
    this.timeInterval = null;
  }

  onResume() {
    this.sdkInstance.call("loadMetadata", this.metaObj);
    this.startInterval();
  }

  onPause() {
    this.stopInterval();
    this.sdkInstance.call("stop");
  }

  onEnd() {
    this.stopInterval();
    this.sdkInstance.call("end");
  }

  onPlay() {
    this.sdkInstance.call("loadMetadata", this.metaObj);
    this.startInterval();
  }

  onSeeked(position) {
    this.currentPosition = position;
  }

  onAdStart(id, type) {
    this.adsObj = {
      assetid: id,
      type,
    };
    this.backupPosition = this.currentPosition;
    this.currentPosition = 0;
    this.sdkInstance.call("loadMetadata", this.adsObj);
    this.startInterval("ad");
  }

  onAdEnd() {
    this.stopInterval();
    this.sdkInstance.call("stop");
    this.currentPosition = this.backupPosition;
    // this.onResume();
  }
}

module.exports = nielsenWarpper;
