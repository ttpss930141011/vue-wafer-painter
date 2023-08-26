<template>
  <div>
    <ul class="flex border-top margin-bottom">
      <li v-for="(item,index) in timeItem" class="timeitem" :key="index">
        <div class="dot"></div>
        <div class="content">{{ item.content }}</div>
        <div class="timestamp">{{ item.timestamp }}</div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

type TimeItem = {
  content: string;
  timestamp: string;
}
const props = defineProps({
  timeItem:{
    type: Array<TimeItem>,
    default:()=>[]
  }
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.border-top {
  border-top: 5px solid #e8e8e8;
  width: fit-content;
}
.dot{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e8e8e8;
  margin-right: 10px;
  top: -18px;
  position: absolute;
}
.timeitem{
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.timestamp{
  color: gray;
  font-size: 12px;
}
</style>
