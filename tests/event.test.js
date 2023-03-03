const eventWarpper = require("../nielsenEventWarpper");
const sdk = require("../sdkInstanceWarpper");

const ggPM = (name, data) => {};
const nlsQ = (appid, sdkInstance) => ({ ggPM });
const NOLBUNDLE = { nlsQ, BUILDVERSION: "1.0.0" };

// mockup app sdk
const mockAppBridge = {
  loadMetadata: (data) => {},
  play: (data) => {},
  end: () => {},
  stop: () => {},
  setPlayheadPosition: (data) => {},
};

describe("event", () => {
  const videoDetail = {
    id: "123",
    title: "test",
    program: "test",
    duration: "00:00:00",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should play vod normal", (done) => {
    const spyPlay = jest.spyOn(mockAppBridge, "play");
    const spyLoadMetadata = jest.spyOn(mockAppBridge, "loadMetadata");
    const spySetPlayheadPosition = jest.spyOn(
      mockAppBridge,
      "setPlayheadPosition"
    );
    const spyStop = jest.spyOn(mockAppBridge, "stop");

    // test
    const sdkInstance = new eventWarpper(
      "live",
      videoDetail,
      "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
      mockAppBridge
    );

    // initial state must called
    expect(spyPlay).toHaveBeenCalled();
    expect(spyLoadMetadata).toHaveBeenCalled();

    // test play
    expect(sdkInstance.timeInterval).toEqual(null);
    sdkInstance.onPlay();
    expect(sdkInstance.timeInterval).not.toEqual(null);
    expect(spyLoadMetadata).toHaveBeenCalledTimes(2);
    setTimeout(() => {
      sdkInstance.onPause();
      expect(sdkInstance.currentPosition).toBeGreaterThanOrEqual(2);
      expect(spySetPlayheadPosition).toHaveBeenCalledTimes(2);
      expect(spyStop).toHaveBeenCalledTimes(1);
      sdkInstance.stopInterval();
      done();
    }, 2500);
  });

  it("should play vod with ad", (done) => {
    const spyPlay = jest.spyOn(mockAppBridge, "play");
    const spyLoadMetadata = jest.spyOn(mockAppBridge, "loadMetadata");
    const spySetPlayheadPosition = jest.spyOn(
      mockAppBridge,
      "setPlayheadPosition"
    );
    const spyStop = jest.spyOn(mockAppBridge, "stop");
    const spyEnd = jest.spyOn(mockAppBridge, "end");

    // test
    const sdkInstance = new eventWarpper(
      "live",
      videoDetail,
      "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
      mockAppBridge
    );

    // initial state must called
    expect(spyPlay).toHaveBeenCalled();
    expect(spyLoadMetadata).toHaveBeenCalled();
    expect(spyLoadMetadata).toHaveBeenCalledTimes(1);

    // test play
    expect(sdkInstance.timeInterval).toBeNull();
    sdkInstance.onPlay();
    expect(spyLoadMetadata).toHaveBeenCalledTimes(2);
    expect(sdkInstance.timeInterval).not.toBeNull();

    setTimeout(() => {
      sdkInstance.onPause();
      expect(spySetPlayheadPosition).toHaveBeenCalledTimes(2);
      expect(spyStop).toHaveBeenCalledTimes(1);
      expect(sdkInstance.timeInterval).toBeNull();

      sdkInstance.onAdStart("111", "preroll");
      expect(sdkInstance.backupPosition).toBeGreaterThanOrEqual(2);
      expect(sdkInstance.currentPosition).toBeGreaterThanOrEqual(0);
      expect(sdkInstance.timeInterval).not.toBeNull();

      setTimeout(() => {
        sdkInstance.onAdEnd();
        expect(spyStop).toHaveBeenCalledTimes(2);
        expect(sdkInstance.timeInterval).toBeNull();

        expect(spyLoadMetadata).toHaveBeenCalledTimes(3);
        expect(sdkInstance.backupPosition).toBeGreaterThanOrEqual(0);
        expect(sdkInstance.currentPosition).toBeGreaterThanOrEqual(2);
        expect(spySetPlayheadPosition).toHaveBeenCalledTimes(4);

        sdkInstance.onResume();
        expect(spyLoadMetadata).toHaveBeenCalledTimes(4);
        expect(sdkInstance.timeInterval).not.toBeNull();

        setTimeout(() => {
          sdkInstance.onEnd();
          expect(sdkInstance.currentPosition).toBeGreaterThanOrEqual(4);
          expect(spySetPlayheadPosition).toHaveBeenCalledTimes(6);
          expect(spyEnd).toHaveBeenCalledTimes(1);

          done();
        }, 2500);
      }, 2500);
    }, 2500);
  });
});
