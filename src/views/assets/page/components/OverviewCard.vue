<template>
    <div class="overview-card">
      <div class="overview-card__bg-l"></div>
      <div class="overview-card__bg-r"></div>
      <div class="overview-card__cont">
            <slot />
      </div>
    </div>
</template>

<style lang="less" scoped>
.overview-card {
    margin: 0 0.32rem;
    padding: 0.38rem 0.32rem 0.24rem 0.32rem;
    background: linear-gradient(to top, #427BFF 0%, #0F49CF 100%);
    border-radius: 0.32rem;
    position: relative;
    overflow: hidden;
    &__bg-l{
      position: absolute;
      left:0;
      bottom:-1rem;
      width: 0.88rem;
      height: 100%;
      &::before{
        content: '';
        width: 4.12rem;
        height: 4.12rem;
        transform: rotate(20.222deg);
        flex-shrink: 0;
        border-radius: 0.6rem;
        background: rgba(255, 255, 255, 0.05);
        position: absolute;
        right: 0;
        bottom:-1.08rem;
      }
      &::after{
        content: '';
        width: 4.12rem;
        height: 4.12rem;
        transform: rotate(20.222deg);
        flex-shrink: 0;
        border-radius: 0.6rem;
        position: absolute;
        right: 0.68rem;
        bottom:-1.4rem;
        border-radius: 0.6rem;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0px 4px 10px 0px rgba(1, 76, 250, 0.20);
      }
    }
    &__bg-r{
      position: absolute;
      right:0;
      top:0;
      width: 2.88rem;
      height: 100%;
      &::before{
        content: '';
        width: 4.12rem;
        height: 4.12rem;
        transform: rotate(20.222deg);
        flex-shrink: 0;
        border-radius: 0.6rem;
        background: rgba(255, 255, 255, 0.05);
        position: absolute;
        left: 0;
        top:-1.48rem;
      }
      &::after{
        content: '';
        width: 4.12rem;
        height: 4.12rem;
        transform: rotate(20.222deg);
        flex-shrink: 0;
        border-radius: 0.6rem;
        position: absolute;
        left: 0.78rem;
        top:-1.8rem;
        border-radius: 0.6rem;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0px 4px 10px 0px rgba(1, 76, 250, 0.20);
      }
    }
    &__cont{
      position: relative;
      z-index: 9;
    }
}
</style>