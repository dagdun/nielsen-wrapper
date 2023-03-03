const sdk = require("../sdkInstanceWarpper");

const ggPM = (name, data) => {};
const nlsQ = (appid, sdkInstance) => ({ ggPM });
const NOLBUNDLE = { nlsQ, BUILDVERSION: "1.0.0" };

// mockup app sdk
const app = {
  loadMetadata: (data) => {},
  play: (data) => {},
  end: (data) => {},
};
describe("sdk", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should selected app", () => {
    const spyApp = jest.spyOn(app, "loadMetadata");

    // test
    const sdkInstance = new sdk("PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126", app);
    expect(sdkInstance.isApp).toBe(true);
    expect(sdkInstance.isAppPlay).toBe(false);

    sdkInstance.call("loadMetadata", { title: "test" });
    expect(sdkInstance.isAppPlay).toBe(true);
    expect(spyApp).toHaveBeenCalled();
  });

  it("should selected app", () => {
    const spyApp = jest.spyOn(app, "end");

    // test
    const sdkInstance = new sdk("PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126", app);
    sdkInstance.call("end");
    expect(sdkInstance.isApp).toBe(true);
    expect(sdkInstance.isAppPlay).toBe(false);
    expect(spyApp).toHaveBeenCalled();
  });

  it("should selected web", () => {
    const spyApp = jest.spyOn(app, "loadMetadata");

    // test
    const sdkInstance = new sdk(
      "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
      NOLBUNDLE
    );
    expect(sdkInstance.isApp).toBe(false);
    sdkInstance.call("loadMetadata", { title: "test" });

    expect(spyApp).not.toHaveBeenCalled();
  });
});
