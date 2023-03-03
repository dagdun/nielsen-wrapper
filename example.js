import nielsenWarpper from "./nielsenEventWarpper";

const VideoPlayer = ({ item }) => {
  const nielsen = new nielsenWarpper("live", item);
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
