<template>
  <div>
    <fake3d-image-effect
        centered
        fill-height-content
        tag="div"
        image="https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/2.jpg"
        image-map="https://cx-dev-s3-test-lamrembg.s3.ap-northeast-1.amazonaws.com/2_depth.png"
    >
    </fake3d-image-effect>
  </div>
</template>

<script>
import { Fake3dImageEffect } from '@luxdamore/vue-fake3d-image-effect';
import '@luxdamore/vue-fake3d-image-effect/dist/Fake3dImageEffect.css';

export default {
  name: "UploadFiles3DVue",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'fake3d-image-effect': Fake3dImageEffect,
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
