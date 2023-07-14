export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

export const doesHttpOnlyCookieExist = (cookiename) => {
  var d = new Date();
  d.setTime(d.getTime() + 1000);
  var expires = "expires=" + d.toUTCString();

  document.cookie = cookiename + "=new_value;path=/;" + expires;
  return document.cookie.indexOf(cookiename + "=") == -1;
};

export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
};

export const validGenres = [
  "action",
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
];

export const validMediaType = ["episode", "movie"];

export const validSources = ["telegram", "googledrive", "onedrive"];

const validMimeTypesObj = {
  opus: "video/ogg",
  ogv: "video/ogg",
  mp4: "video/mp4",
  mov: "video/mp4",
  m4v: "video/mp4",
  mkv: "video/x-matroska",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  aac: "audio/aac",
  caf: "audio/x-caf",
  flac: "audio/flac",
  oga: "audio/ogg",
  wav: "audio/wav",
  m3u8: "application/x-mpegURL",
  mpd: "application/dash+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

export const validMimeTypes = [
  { type: "opus,ogv", value: "video/ogg" },
  { type: "mp4,mov,m4v", value: "video/mp4" },
  { type: "mkv", value: "video/x-matroska" },
  { type: "m4a", value: "audio/mp4" },
  { type: "mp3", value: "audio/mpeg" },
  { type: "aac", value: "audio/aac" },
  { type: "caf", value: "audio/x-caf" },
  { type: "flac", value: "audio/flac" },
  { type: "oga", value: "audio/ogg" },
  { type: "wav", value: "audio/wav" },
  { type: "m3u8", value: "application/x-mpegURL" },
  { type: "mpd", value: "application/dash+xml" },
  { type: "jpg,jpeg", value: "image/jpeg" },
  { type: "gif", value: "image/gif" },
  { type: "png", value: "image/png" },
  { type: "svg", value: "image/svg+xml" },
  { type: "webp", value: "image/webp" },
];

export function getRandomColor() {
  const colors = [
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function getRandomHexColor() {
  const colors = [
    "#db2197",
    "#653233",
    "#d97706",
    "#ea580c",
    "#57534e",
    "#4d7c0f",
    "#a16207",
    "#047857",
    "#1d4ed8",
    "#7e22ce",
    "#be185d",
    "#e11d48",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
