<template>
  <div class="stock_description">
    <div class="flex flex-col mb-[0.42rem]">
      <div class="flex flex-row justify-between items-center mb-[0.16rem]">
        <span class="text-[0.32rem] text-[#061023] font-semibold">已收盘</span>
        <span class="text-[0.24rem] text-[#061023]">{{ props.data.closets }} {{ props.data.region == 'us' ? '美东' : props.data.region == 'india' ? '印度' :  props.data.region == 'japan' ? '日本' : '韩国' }}</span>
      </div>
      <div class="flex flex-row items-center">
        <div>
          <span class="text-[0.24rem] text-[#061023]"
            >更新时间：{{ props.data.currentts }}</span
          >
        </div>
        <div class="re_render" @click="update"></div>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <div
        class="flex flex-col up_price w-[2.1532rem] justify-between h-[1.52rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem] pl-[0.1rem] pr-[0.1rem]"
      >
        <span class="text-[0.28rem] text-[#061023]">{{ props.data.stock[0]['symbol'] }}</span>
        <span class="stock_price">43077.00</span>
        <div class="flex flex-row justify-between stock_detail">
          <span>337.28</span>
          <span>+0.79%</span>
        </div>
      </div>
      <div
        class="flex flex-col down_price w-[2.1532rem] justify-between h-[1.52rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem] pl-[0.1rem] pr-[0.1rem]"
      >
        <span class="text-[0.28rem] text-[#061023]">{{ props.data.stock[1]['symbol'] }}</span>
        <span class="stock_price">18367.08</span>
        <div class="flex flex-row justify-between stock_detail">
          <span>51.49</span>
          <span>-0.28%</span>
        </div>
      </div>
      <div
        class="flex flex-col up_price w-[2.1532rem] justify-between h-[1.52rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem] pl-[0.1rem] pr-[0.1rem]"
      >
        <span class="text-[0.28rem] text-[#061023]">{{ props.data.stock[2]['symbol'] }}</span>
        <span class="stock_price">5842.47</span>
        <div class="flex flex-row justify-between stock_detail">
          <span>27.21</span>
          <span>+0.47%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['update'])
const update = () => {
  emits('update')
}
const props = defineProps({region: String, data: Object})

</script>

<style lang="less" scoped>
.stock_description {
  padding: 0 0.32rem;
  margin-top: 0.34rem;
  display: flex;
  flex-direction: column;

  .re_render {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.12rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M11.25 4.87489V2.24989L10.3939 3.10601C9.91589 2.38181 9.26575 1.78747 8.50169 1.37622C7.73762 0.96496 6.88347 0.74963 6.01576 0.749512C3.11626 0.749512 0.765381 3.10001 0.765381 5.99989C0.765381 8.89976 3.11626 11.2503 6.01576 11.2503C7.06067 11.2505 8.08189 10.9389 8.94873 10.3554C9.81558 9.77198 10.4886 8.94315 10.8818 7.97501C10.9267 7.86447 10.9258 7.74061 10.8794 7.63069C10.833 7.52077 10.7448 7.43379 10.6343 7.38889C10.5795 7.36665 10.5209 7.35542 10.4619 7.35582C10.4028 7.35623 10.3444 7.36826 10.2899 7.39125C10.18 7.43766 10.093 7.52584 10.0481 7.63639C9.72223 8.43857 9.16445 9.1253 8.44613 9.60874C7.72781 10.0922 6.88161 10.3504 6.01576 10.3503C3.61313 10.3503 1.66538 8.40251 1.66538 5.99989C1.66538 3.59726 3.61313 1.64951 6.01576 1.64951C7.56788 1.64951 8.96813 2.47076 9.74251 3.75701L8.62501 4.87489H11.25Z" fill="%23014CFA"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .up_price {
    background-image: linear-gradient(to bottom, #ffffff, #e4f6ed);

    .stock_price {
      font-size: 0.3rem;
      font-weight: 600;
      color: #18b762;
    }

    .stock_detail {
        width: 100%;
      font-size: 0.24rem;
      font-weight: 400;
      color: #18b762;
    }
  }

  .down_price {
    background-image: linear-gradient(to bottom, #ffffff, #f4e7e5);

    .stock_price {
      font-size: 0.3rem;
      font-weight: 600;
      color: #e8503a;
    }

    .stock_detail {
        width: 100%;
      font-size: 0.24rem;
      font-weight: 400;
      color: #e8503a;
    }
  }
}
</style>
