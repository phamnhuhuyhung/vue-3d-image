import http from "../http-common";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.put("/sssssss.jpg", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  }

  getFiles() {
    // return http.get("/files");
    console.log('zong')
  }
}

export default new UploadFilesService();
