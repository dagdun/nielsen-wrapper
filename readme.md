# install

`yarn install`

# unittest

`yarn test`

# How to use

## App

```javascript
import nielsenWarpper from "./nielsenEventWarpper";
import { NativeModules } from 'react-native';


const VideoPlayer = ({ item }) => {
  const nielsen = new nielsenWarpper("live",
      item,
      "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
      NativeModules.NielsenAppApiBridge);

  return (
    <video
      src={item.url}
      onPlay={() => nielsen.onPlay()}
      onPause={() => nielsen.onPause()}
      onSeeked={(position) => nielsen.onSeeked(position)}
      onEnded={() => nielsen.onEnd()}
      onAdStart={(id, type) => nielsen.onAdStart(id, type)}
      onAdEnd={() => nielsen.onAdEnd()}
    />
  );
};

export default VideoPlayer;
```

## Web

```javascript
import nielsenWarpper from "./nielsenEventWarpper";

const VideoPlayer = ({ item }) => {
  const nielsen = new nielsenWarpper("live",
      item,
      "PA2F9A67F-564A-4EA3-94E5-2C49BDEEF126",
      NOLBUNDLE);
  return (
    <video
      src={item.url}
      onPlay={() => nielsen.onPlay()}
      onPause={() => nielsen.onPause()}
      onSeeked={(position) => nielsen.onSeeked(position)}
      onEnded={() => nielsen.onEnd()}
      onAdStart={(id, type) => nielsen.onAdStart(id, type)}
      onAdEnd={() => nielsen.onAdEnd()}
    />
  );
};

export default VideoPlayer;
```
