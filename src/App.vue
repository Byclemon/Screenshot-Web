<template>
  <div class="app">
    <Sidebar :devices="devices" @selectDevice="updateSelectedDevice" @changePage="updateSelectedPage" @uploadImage="onFileChange" @exportImage="exportImage" />
    <div class="main-content">
      <router-view :selectedDevice="selectedDevice" :imageSrc="imageSrc" @exportImage="exportImage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import { devices } from './devices';

const selectedDevice = ref(devices[0]);
const imageSrc = ref(null);

function updateSelectedDevice(device) {
  selectedDevice.value = device;
}

function updateSelectedPage(page) {
  // 处理页面切换逻辑
}

function onFileChange(event) {
  if (event && event.target && event.target.files) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageSrc.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    console.error("File input event is not valid.");
  }
}

function exportImage() {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screen.png';
    link.click();
  }
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>