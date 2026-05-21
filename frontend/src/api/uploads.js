import API from "./auth";

const uploadFile = (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(endpoint, formData).then((res) => res.data);
};

export const uploadMarkerImage = (file) => uploadFile("/uploads/marker-image", file);
export const uploadMarkerTarget = (file) => uploadFile("/uploads/marker-target", file);
export const generateEighthWallTarget = ({ markerImageUrl, targetName }) =>
  API.post("/uploads/eighthwall-target", { markerImageUrl, targetName }).then((res) => res.data);
export const uploadModel = (file) => uploadFile("/uploads/model", file);
export const uploadVideo = (file) => uploadFile("/uploads/video", file);
