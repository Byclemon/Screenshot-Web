<template>
  <div class="footer">
    <div class="ad-space">
      <!-- 在这里放置广告内容 -->
      <!-- <p>广告位</p> -->
    </div>
    <div class="copyright">
      <p>© 2024 <a href="https://github.com/Byclemon" target="_blank" rel="noopener noreferrer">Byclemon</a>. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加任何需要的逻辑
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 15px;

}

.ad-space {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
}

.ad-space p {
  margin: 0;
}

.copyright {
  font-size: 12px;
  color: #666;
}

.copyright a {
  color: #555;
  text-decoration: none;
  transition: color 0.3s;
}

.copyright a:hover {
  color: #0056b3;
}
</style>