# install

`yarn install`

# unittest

`yarn test`

# App

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
      onPlay={() => nielsen.play()}
      onPause={() => nielsen.pause()}
      onSeeked={(position) => nielsen.seeked(position)}
      onEnded={() => nielsen.end()}
      onAdStart={(id, type) => nielsen.adStart(id, type)}
      onAdEnd={() => nielsen.adEnd()}
    />
  );
};

export default VideoPlayer;
```

# Web

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
      onPlay={() => nielsen.play()}
      onPause={() => nielsen.pause()}
      onSeeked={(position) => nielsen.seeked(position)}
      onEnded={() => nielsen.end()}
      onAdStart={(id, type) => nielsen.adStart(id, type)}
      onAdEnd={() => nielsen.adEnd()}
    />
  );
};

export default VideoPlayer;
```
