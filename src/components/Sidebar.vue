<template>
  <div class="sidebar">
    <h2>设备选择</h2>
    <ul>
      <li
        v-for="device in devices"
        :key="device.name"
        @click="selectDevice(device)"
      >
        {{ device.name }}
      </li>
    </ul>
    <h2>页面选择</h2>
    <div class="button-group">
      <button
        :class="{ active: selectedPage === 'home' }"
        @click="changePage('home')"
      >
        主页
      </button>
      <button
        :class="{ active: selectedPage === 'lock' }"
        @click="changePage('lock')"
      >
        锁屏页
      </button>
    </div>
    <h2>图片操作</h2>
    <div class="file-input-container">
      <label for="file-upload" class="custom-file-upload"> 选择图片 </label>
      <input
        id="file-upload"
        type="file"
        ref="fileInput"
        @change="uploadImage"
      />
      <div v-if="imageSrc" class="image-preview">
        <img :src="imageSrc" alt="预览图片" />
      </div>
    </div>
    <button :disabled="!imageSrc" @click="exportImage" class="export-button">
      导出图片
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["devices"]);
const emit = defineEmits([
  "selectDevice",
  "changePage",
  "uploadImage",
  "exportImage",
]);

const selectedPage = ref("home");
const imageSrc = ref("");
const fileInput = ref(null);

function selectDevice(device) {
  emit("selectDevice", device);
}

function changePage(page) {
  selectedPage.value = page;
  emit("changePage", page);
}

function uploadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target.result;
      emit("uploadImage", event); // 确保传递整个事件对象
    };
    reader.readAsDataURL(file);
  }
}

function exportImage() {
  emit("exportImage");
}

// 监听页面切换事件，重置文件输入
watch(selectedPage, () => {
  if (fileInput.value) {
    fileInput.value.value = null; // 重置文件输入的值
    imageSrc.value = ""; // 清空已选择的图片
  }
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 40px); /* 考虑全局边距 */
  position: relative;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 1px solid #34495e;
  padding-bottom: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

li:hover {
  background-color: #34495e;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #34495e;
  color: #ecf0f1;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.active {
  background-color: #3b5998;
}

button:hover {
  background-color: #3b5998;
}

button:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.file-input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-file-upload {
  display: inline-block;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #34495e;
  color: #ecf0f1;
  text-align: center;
  transition: background-color 0.3s;
}

.custom-file-upload:hover {
  background-color: #3b5998;
}

input[type="file"] {
  display: none;
}

.image-preview img {
  max-width: 100%;
  border-radius: 5px;
  margin-top: 10px;
}

.export-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}
</style>
