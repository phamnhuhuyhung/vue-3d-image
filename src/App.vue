<template>
  <div id="app">
    <div class="paddingLeft20">
      <div style="margin: 20px 0">
        <h4>Upload Files</h4>
      </div>

      <!-- <upload-files></upload-files> -->
      <UploadFilesDemo/>
      <!-- <UploadFiles3DVue/> -->
    </div>
  </div>
</template>

<script>
// import UploadFiles from "./components/UploadFiles";
import UploadFilesDemo from "./components/UploadFilesDemo.vue";
// import UploadFiles3DVue from "./components/UploadFiles3DVue.vue";


export default {
  name: "App",
  components: {
    // UploadFiles
    UploadFilesDemo
    // UploadFiles3DVue
  }
};
</script>


<style>
.app {
  min-width: 700px;
}
.paddingLeft20 {
  margin: auto;
  width: 50%;
  padding-bottom: 250px;
}
h4 {
  margin-bottom: 0;
}
</style>
