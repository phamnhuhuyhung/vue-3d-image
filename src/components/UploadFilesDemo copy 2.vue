<template>
  <div>
    <input type="file" @change="uploadFile" ref="file">
    <button @click="submitFile">Upload!</button>
    <div v-if="isUploadSuccess" class="uploadedImage">
      <div class="marginRight20">
        <p>Uploaded Image</p>
        <img :src="uploadedImage" id="uploadedImage11" alt="" @load="onUploadImgLoad" crossOrigin="Anonymous"/><br/>
        <button @click="convertToNoBG(uploadedImage)">REMOVE BACKGROUND</button>
      </div>
      <div class="marginRight20" v-if="noBGImg">
        <p>Remove background</p>
        <img v-show="!mapImages" :src="noBGImg" alt="" id="uploadedImage" @load="onLoadNOBG" crossOrigin="Anonymous" :width="w" :height="h"/>
        <img v-show="mapImages" :src="noBGImgSrc" alt="" crossOrigin="Anonymous" :width="w" :height="h"/><br/>
        <button @click="convert">SHOW DEPTH MAP</button>
      </div>
      <div class="marginRight20" id="depthMap">
        <p v-if="mapImages">Depth Map</p>
        <p v-else-if="isLoading && !mapImages">Loading</p>
        <!-- <canvas id="resultCanvas"></canvas> -->
      </div>
      <div v-if="mapImages" class="displayImage">
        <div>
          <p >Result</p>
          <fake3d-image-effect
            tag="div"
            :image="noBGImgSrc"
            :image-map="mapImages"
            :height="h"
            :width="w"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {tensorflowFunc} from '../services/tensorFlow.js'
import { Fake3dImageEffect } from '@luxdamore/vue-fake3d-image-effect';
import '@luxdamore/vue-fake3d-image-effect/dist/Fake3dImageEffect.css';

export default {
  name: "upload-files",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'fake3d-image-effect': Fake3dImageEffect,
  },
  data() {
    return {
      images: null,
      isUploadSuccess: false,
      uploadedImage: null,
      convertedImage: null,
      isLoaded: false,
      deg: 0,
      sliderValue: 0,
      scriptAdded: false,
      mapImages: null,
      isLoading: false,
      url: null,
      w: 0,
      h: 0,
      loadingNoBG: false,
      noBGImg: null,
      noBGImgSrc: null,
      newFile: null,
      showPreview: false
    };
  },
  methods: {
    onLoadNOBG() {
      let img = document.getElementById("uploadedImage");
      console.log(img);
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, this.w, this.h);
      let dataURL = canvas.toDataURL(this.Images.tpye);
      const file = this.dataURLtoFile(dataURL, 'convert_' + this.Images.name);
      this.newFile = file;

    },
    async convertToNoBG (img) {
      fetch('https://k3nb3wm4vuxmel6raf2tg2ri2e0orfwj.lambda-url.ap-northeast-1.on.aws/?src=' + img)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          let objectURL = URL.createObjectURL(blob);
          this.noBGImg = objectURL;
          this.noBGImgSrc = objectURL;
      });
    },
    rotate() {
      this.deg += 5;
    },
    async convert () {
      this.showPreview = true
      this.isLoading = true;
      const headers = { 'Content-Type': this.newFile.type };
      axios.put('https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+this.newFile.name, this.newFile, { headers }).then((res) => {
        console.log(res, 'OK')
        this.isUploadSuccess = true
        this.noBGImg = 'https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+this.newFile.name
      }).catch(
        function (error) {
          console.log('Show error notification!', error)
        }
      )
      const canvas = await tensorflowFunc();
      const aaa = document.getElementById('depthMap');
      aaa.appendChild(canvas);
      const jpegUrl = canvas.toDataURL("image/png");
      this.mapImages = jpegUrl;
      this.isLoading = false;
    },
    selectFile() {
      this.selectedFiles = this.$refs.file.files;
    },

    uploadFile() {
      this.Images = this.$refs.file.files[0];
      this.url = this.$refs.file.files[0];
    },
    onUploadImgLoad() {
      let img = document.getElementById('uploadedImage11'); 
      //or however you get a handle to the IMG
      this.w = String(img.clientWidth) + 'px';
      this.h = String(img.clientHeight) + 'px';
    },
    submitFile() {
      this.isUploadSuccess = false;
      this.uploadedImage = null;
      this.convertedImage = null;
      this.isLoaded = false
      const formData = new FormData();
      formData.append('file', this.Images);
      const headers = { 'Content-Type': this.Images.type };
      console.log(this.Images)
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
  img {
    max-width: 500px;
  }
  .uploadedImage {
    margin-top: 20px;
    display: flex;
  }
  .marginRight20 {
    margin-right: 20px;
    max-width: 500px;
  }
  .converting {
    text-align: center;
    font-size: 20px;
    margin-top: 30px;
    font-size: bold;
  }
  .rotate {
    transition: transform 0.1s ease-in-out;
  }
  .range-slider {
    width: 250px !important;
    margin-bottom: 30px;
    margin-top: 30px;
  }
  .displayImage {
    position: relative;
    display: flex;
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
