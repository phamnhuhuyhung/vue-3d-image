<template>
  <div>
    <input type="file" @change="uploadFile" ref="file">
    <button @click="submitFile">Upload!</button>
    <div v-if="isUploadSuccess" class="uploadedImage">
      <div class="marginRight20">
        <p>Uploaded Image</p>
        <img :src="uploadedImage" alt="" id="uploadedImage" @load="onUploadImgLoad"/><br/>
        <button @click="convert">CONVERT IT</button>
      </div>
      <div v-if="convertedImage" class="displayImage">
        <p class="converting" v-show="!isLoaded">CONVERTING</p>
        <section id="stage" v-if="convertedImage">
          <p v-show="isLoaded" id="convertedTitle">Converted Image</p>
          <div id="logo" class="spin"  v-show="isLoaded">
            <img :src="convertedImage" v-show="isLoaded" @load="onImgLoad"  alt="HTML5 logo">
          </div>
        </section>
        <aside v-show="isLoaded"><form></form></aside>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "vue-range-slider/dist/vue-range-slider.css";

export default {
  name: "upload-files",
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
    };
  },
  methods: {
    rotate() {
      this.deg += 5;
    },
    convert() {
      this.convertedImage = 'https://k3nb3wm4vuxmel6raf2tg2ri2e0orfwj.lambda-url.ap-northeast-1.on.aws/?src=https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/'+this.Images.name
    },
    selectFile() {
      this.selectedFiles = this.$refs.file.files;
    },

    uploadFile() {
      this.Images = this.$refs.file.files[0];
      this.deg = 0;
    },
    onUploadImgLoad() {
      let img = document.getElementById('uploadedImage'); 
      //or however you get a handle to the IMG
      this.w = img.clientWidth;
      this.h = img.clientHeight;
    },
    submitFile() {
      this.isUploadSuccess = false;
      this.uploadedImage = null;
      this.convertedImage = null;
      this.isLoaded = false
      const formData = new FormData();
      formData.append('file', this.Images);
      const headers = { 'Content-Type': this.Images.type };
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
    onImgLoad () {
      this.isLoaded = true
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', './script.js')
      document.head.appendChild(recaptchaScript)
    }
  },
};
</script>

<style>
  img {
    max-width: 300px;
  }
  .uploadedImage {
    margin-top: 20px;
    display: flex;
  }
  .marginRight20 {
    margin-right: 40px;
    max-width: 300px;
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
    width: 300px;
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
  #logo img{
    width:300px;
    padding:20px;
    display:block;
  }
  #stage:hover{
    cursor: move;
  }
</style>
