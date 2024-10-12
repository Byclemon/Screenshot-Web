<template>
  <div class="home-screen">
    <div class="canvas-container">
      <canvas ref="canvas" :width="selectedDevice.width" :height="selectedDevice.height"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getLunarDate } from '../utils/lunarDate';

// 假设这些是图标的路径
import phoneIcon from '../assets/phone.png';
import messageIcon from '../assets/message.png';
import browserIcon from '../assets/browser.png';
import galleryIcon from '../assets/gallery.png';
import signalIcon from '../assets/signal.png';
import wifiIcon from '../assets/wifi.png';
import batteryIcon from '../assets/battery.png';
import musicIcon from '../assets/music.png';
import settingsIcon from '../assets/settings.png';

const props = defineProps(['selectedDevice', 'imageSrc']);
const canvas = ref(null);

function drawHomeScreen() {
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
    let iconX = canvas.value.width - 20;

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
    ctx.font = `${props.selectedDevice.fontSize}px Arial`;
    ctx.fillText(timeString, canvas.value.width / 2, canvas.value.height / 3);

    ctx.font = `${props.selectedDevice.lunarFontSize}px Arial`;
    ctx.fillText(`${dateString} ${lunarDate}`, canvas.value.width / 2, canvas.value.height / 3 + props.selectedDevice.timeDateSpacing);

    // 根据设备类型选择图标
    let dockIcons;
    if (props.selectedDevice.name === 'MacBook') {
      dockIcons = [phoneIcon, messageIcon, browserIcon, galleryIcon, musicIcon, settingsIcon];
    } else {
      dockIcons = [phoneIcon, messageIcon, browserIcon, galleryIcon];
    }

    const dockIconSize = props.selectedDevice.dockIconSize;
    const dockPadding = 20;
    const dockTotalWidth = dockIcons.length * dockIconSize + (dockIcons.length - 1) * dockPadding;
    let dockX = (props.selectedDevice.width - dockTotalWidth) / 2;
    const dockY = props.selectedDevice.height - dockIconSize - 20;

    // 绘制底部黑色半透明背景，增加宽度
    const backgroundPadding = 30; // 增加背景的宽度
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(dockX - backgroundPadding, dockY - 10);
    ctx.arcTo(dockX + dockTotalWidth + backgroundPadding, dockY - 10, dockX + dockTotalWidth + backgroundPadding, dockY + dockIconSize + 10, 20);
    ctx.arcTo(dockX + dockTotalWidth + backgroundPadding, dockY + dockIconSize + 10, dockX - backgroundPadding, dockY + dockIconSize + 10, 20);
    ctx.arcTo(dockX - backgroundPadding, dockY + dockIconSize + 10, dockX - backgroundPadding, dockY - 10, 20);
    ctx.arcTo(dockX - backgroundPadding, dockY - 10, dockX + dockTotalWidth + backgroundPadding, dockY - 10, 20);
    ctx.closePath();
    ctx.fill();

    dockIcons.forEach(icon => {
      const img = new Image();
      img.src = icon;
      img.onload = () => {
        ctx.drawImage(img, dockX, dockY, dockIconSize, dockIconSize);
        dockX += dockIconSize + dockPadding;
      };
    });
  };
  img.src = props.imageSrc;
}

watch(() => props.selectedDevice, drawHomeScreen);
watch(() => props.imageSrc, drawHomeScreen);
</script>

<style scoped>
.home-screen {
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