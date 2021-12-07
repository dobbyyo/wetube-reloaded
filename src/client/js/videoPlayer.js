const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currenTime");
const totalTime = document.querySelector("#totalTime");
const timeLine = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullScreen");
const fullscreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let = volumeValue = 0.5;
video.volume = volumeValue;
let videoExit = false;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
    videoExit = true;
  } else {
    video.pause();
    videoExit = false;
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? "0" : volumeValue;
};
const handelVolumeChange = (e) => {
  const {
    target: { value },
  } = e;
  if (volumeRange.value === "0") {
    video.muted = true;
  } else {
    video.muted = false;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeValue = value;
  video.volume = value;
};
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};
const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};
const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtnIcon.classList = "fas fa-compress";
  }
};

const hiedControls = () => {
  videoControls.classList.remove("showing");
};
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hiedControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hiedControls, 3000);
};
const handleKeytimeMove = (e) => {
  switch (e.keyCode) {
    case 32: //space bar
      handlePlayClick();
      break;
    case 39: //오른쪽 방향키
      video.currentTime = video.currentTime + 5;
      break;
    case 37: // 왼쪽방향키
      video.currentTime = video.currentTime - 5;
      break;
    case 38: // 위 방향키
      if (videoExit) {
        volumeValue += 0.1;
        volumeRange.value = volumeValue;
        video.volume = volumeRange.value;
        e.preventDefault();
        break;
      }
      break;
    case 40:
      if (videoExit) {
        volumeValue -= 0.1;
        volumeRange.value = volumeValue;
        video.volume = volumeRange.value;
        e.preventDefault();
        break;
      }
      break;
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handelVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handleKeytimeMove);
