import axios from "axios";

export default axios.create({
  baseURL: "https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com",
  headers: {
    "Content-type": "application/json"
  }
});
