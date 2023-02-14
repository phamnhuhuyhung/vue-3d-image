<template>
  <div id="123">
    <img :src="defaultImage" id="uploadedImage" @load="onImgLoad"
    crossorigin='anonymous'/>
    <p v-if="mapImages">DepthMap</p>
    <img v-if="mapImages" :src="mapImages"/>
    <p v-if="isLoading">is Loading</p>
    <h1 v-if="mapImages">Result</h1>
    <fake3d-image-effect
        v-if="mapImages"
        centered
        fill-height-content
        tag="div"
        :image="defaultImage"
        :image-map="mapImages"
    />
  </div>
</template>

<script>
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
      defaultImage: 'https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/dog1.jpg',
      mapImages: null,
      isLoading: false
    };
  },
  methods: {
    async onImgLoad () {
      this.isLoading = true;
      const canvas = await tensorflowFunc();
      const jpegUrl = canvas.toDataURL("image/png");
      this.mapImages = jpegUrl
      this.isLoading = false;
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
