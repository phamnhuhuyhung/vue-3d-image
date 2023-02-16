<template>
  <div>
    <div class="flex-auto">
      <image-uploader @input="uploadFile" :maxWidth="500" outputFormat="blob" :preview="false"></image-uploader>
      <button @click="submitFile">Upload!</button>
    </div>
    <div v-if="isUploadSuccess" class="uploadedImage">
      <div class="marginRight20">
        <p>1. Uploaded Image</p>
        <img :src="uploadedImage" id="uploadedImage11" alt="" @load="onUploadImgLoad" crossOrigin="Anonymous"/><br/>
        <button @click="convertToNoBG(uploadedImage)">REMOVE BACKGROUND</button>
      </div>
      <div class="marginRight20" v-if="noBGImg">
        <p>2. Remove background</p>
        <img :src="noBGImgSrc" alt="" id="uploadedImage" crossOrigin="Anonymous" :width="w" :height="h"/><br/>
        <canvas id="noBGImgSrcCanvas"/>
        <button @click="rotate()">EDIT ROTATE</button>
        <button @click="convert">SHOW DEPTH MAP</button>
      </div>
    </div>
    <div v-if="isUploadSuccess" class="uploadedImage">
      <div class="marginRight20" id="depthMap">
        <p v-if="mapImages">3. Depth Map</p>
        <p v-else-if="isLoading && !mapImages">Loading</p>
        <img v-if="mapImages" :src="mapImages"/>
      </div>
      <div v-if="noBGImgSrc" class="displayImage">
        <div class="displayImageID">
          <p v-if="mapImages">4. 3D</p>
          <div id="wrap"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {tensorflowFunc} from '../services/tensorFlow.js'
import {dataURItoBlob} from '../services/canvasToUrl.js'
import {draw3d, removeDraw3d} from '../services/draw3d.js'
import ImageUploader from 'vue-image-upload-resize'

export default {
  name: "upload-files",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ImageUploader,
  },
  data() {
    return {
      isUploadSuccess: false,
      uploadedImage: null,
      isLoaded: false,
      mapImages: null,
      isLoading: false,
      w: 0,
      h: 0,
      width: 0,
      height: 0,
      noBGImg: null,
      noBGImgSrc: null,
      newFile: null,
      showPreview: false,
    };
  },
  methods: {
    rotate() {
    },
    async convertToNoBG (img) {
      fetch('https://k3nb3wm4vuxmel6raf2tg2ri2e0orfwj.lambda-url.ap-northeast-1.on.aws/?src=' + img)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          const headers = { 'Content-Type': blob.type };
          const newURL = 'https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+'converted_image_'+this.Images.name;
            axios.put(newURL, blob, { headers }).then(() => {
              this.isUploadSuccess = true;
              this.noBGImg = newURL;
              this.noBGImgSrc = newURL;
            }).catch(
              function (error) {
                console.log('Show error notification!', error)
              }
            )
      });
    },
    async convert () {
      this.isLoading = true;
      const canvas = await tensorflowFunc();
      let img_b64 = canvas.toDataURL('image/png');
      let blob = dataURItoBlob(img_b64);
      const headers = { 'Content-Type': blob.type };
      const newURL = 'https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+'converted_image_depth_'+this.Images.name;
        axios.put(newURL, blob, { headers }).then(() => {
          this.mapImages = newURL;
          draw3d(this.width, this.height, this.noBGImgSrc, this.mapImages);
          this.isLoading = false;
        }).catch(
          function (error) {
            console.log('Show error notification!', error)
          }
        )
    },
    selectFile() {
      this.selectedFiles = this.$refs.file.files;
    },

    uploadFile(file) {
      var fileInput = document.getElementById('fileInput');   
      this.Images = file;
      this.Images.name = fileInput.files[0].name;
    },
    onUploadImgLoad() {
      let img = document.getElementById('uploadedImage11'); 
      //or however you get a handle to the IMG
      this.width = img.clientWidth;
      this.height = img.clientHeight;
      this.w = String(img.clientWidth) + 'px';
      this.h = String(img.clientHeight) + 'px';
    },
    submitFile() {
      if (this.uploadedImage) {
        removeDraw3d();
      }
      this.isUploadSuccess = false;
      this.noBGImgSrc = null;
      this.noBGImg = null;
      this.uploadedImage = null;
      this.isLoaded = false;
      const headers = { 'Content-Type': this.Images.type };
      this.mapImages = null;
      axios.put('https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+this.Images.name, this.Images, { headers }).then((res) => {
        console.log(res, 'OK')
        this.isUploadSuccess = true
        this.uploadedImage = 'https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+this.Images.name
      }).catch(
        function (error) {
          console.log('Show error notification!', error)
        }
      )
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    }
  },
};
</script>

<style>
  .flex-auto {
    display: flex;
    gap: 10px;
  }
  .uploadedImage {
    margin-top: 20px;
    display: flex;
  }
  .marginRight20 {
    margin-right: 20px;
    padding-bottom: 40px;
  }
  .marginRight10 {
    margin-right: 10px;
  }
  .converting {
    text-align: center;
    font-size: 20px;
    margin-top: 30px;
    font-size: bold;
  }
  .range-slider {
    width: 250px !important;
    margin-bottom: 30px;
    margin-top: 30px;
  }
  .displayImage {
    position: relative;
    display: flex;
    width: 100%;
  }
  .displayImageID {
    width: 100%;
  }
  #stage {
    width: 400px;
    height: 400px;
    float: left;
  }
  h1{
    font-family: futura,sans-serif;
    text-transform: uppercase;
    font-weight: normal;
    color: #666;
    font-size: 32px;
  }
  form{
    width: 500px;
    float: left;
    background: #ccc;
    padding: 10px;
    margin-top: 1em;
  }
  form p{
    padding: 0.5em 0;
  }
  button{
    padding: 5px 10px;
  }
  label, span{
    font-weight: bold;
    padding: 0 0.5em;
  }
  fieldset{
    border:none;
  }
  #stage:hover{
    cursor: move;
  }
  .flex {
    display: flex;
  }
</style>
