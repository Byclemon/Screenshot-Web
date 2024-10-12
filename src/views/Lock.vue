<template>
  <div class="lock-screen">
    <div class="canvas-container">
      <canvas ref="canvas" :width="selectedDevice.width" :height="selectedDevice.height"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getLunarDate } from '../utils/lunarDate';

// 假设这些是图标的路径
import signalIcon from '../assets/signal.png';
import wifiIcon from '../assets/wifi.png';
import batteryIcon from '../assets/battery.png';
import flashlightIcon from '../assets/flashlight.png';
import cameraIcon from '../assets/camera.png';

const props = defineProps(['selectedDevice', 'imageSrc']);
const canvas = ref(null);

function drawLockScreen() {
  if (!props.imageSrc || !props.selectedDevice) return;

  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const img = new Image();
  img.onload = () => {
    const scale = Math.max(
      props.selectedDevice.width / img.width,
      props.selectedDevice.height / img.height
    );
    const x = (props.selectedDevice.width / 2) - (img.width / 2) * scale;
    const y = (props.selectedDevice.height / 2) - (img.height / 2) * scale;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // 绘制顶部状态栏
    const carrierInfo = "中国移动";
    ctx.fillStyle = '#fff';
    ctx.font = `${props.selectedDevice.carrierFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(carrierInfo, 20, 30);

    const statusBarIconSize = props.selectedDevice.statusBarIconSize;
    const iconY = 10;
    let iconX = props.selectedDevice.width - 20;

    [batteryIcon, wifiIcon, signalIcon].forEach(icon => {
      const img = new Image();
      img.src = icon;
      img.onload = () => {
        ctx.drawImage(img, iconX - statusBarIconSize, iconY, statusBarIconSize, statusBarIconSize);
        iconX -= statusBarIconSize + 10;
      };
    });

    // 绘制时间和农历日期
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = currentTime.toLocaleDateString();
    const lunarDate = getLunarDate(currentTime);

    ctx.textAlign = 'center';
    ctx.font = `${props.selectedDevice.lockScreenFontSize}px Arial`;
    ctx.fillText(timeString, props.selectedDevice.width / 2, props.selectedDevice.height / 3);

    ctx.font = `${props.selectedDevice.lunarFontSize}px Arial`;
    ctx.fillText(`${dateString} ${lunarDate}`, props.selectedDevice.width / 2, props.selectedDevice.height / 3 + props.selectedDevice.timeDateSpacing);

    // 绘制底部图标
    const lockScreenIconSize = props.selectedDevice.lockScreenIconSize;
    const bottomIconY = props.selectedDevice.height - lockScreenIconSize - 20;

    const drawBottomIcon = (icon, x) => {
      // 绘制半透明圆形背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(x + lockScreenIconSize / 2, bottomIconY + lockScreenIconSize / 2, lockScreenIconSize / 2 + 10, 0, Math.PI * 2);
      ctx.fill();

      // 绘制图标
      const img = new Image();
      img.src = icon;
      img.onload = () => {
        ctx.drawImage(img, x, bottomIconY, lockScreenIconSize, lockScreenIconSize);
      };
    };

    drawBottomIcon(flashlightIcon, 60);
    drawBottomIcon(cameraIcon, props.selectedDevice.width - 60 - lockScreenIconSize);
  };
  img.src = props.imageSrc;
}

watch(() => props.selectedDevice, drawLockScreen);
watch(() => props.imageSrc, drawLockScreen);
</script>

<style scoped>
.lock-screen {
  text-align: center;
  
}

.canvas-container {
  display: inline-block;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 500px; /* 固定高度 */
  width: auto; /* 自动宽度以保持比例 */
  overflow: hidden; /* 隐藏溢出内容 */
}

canvas {
  height: 100%; /* 让 Canvas 高度自适应容器 */
  width: auto; /* 让 Canvas 宽度等比缩放 */
}
</style>