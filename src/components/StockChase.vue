<template>
  <div class="market_stock_chase">
    <div class="header_container flex flex-row justify-between items-center">
      <div class="text-[0.32rem] items-center font-semibold">
        <span>涨停追击</span>
      </div>
      <div class="header_text flex items-center text-[0.28rem]">
        <div class="header_eff_text"><span>赚钱效应</span></div>
        <div class="header_noti_text"><span>强</span></div>
      </div>
    </div>
    <div class="graph_container">
      <div class="chase_container">
        <div class="chase_text">
          <span style="margin-right: 0.2rem">涨跌停对比</span>
          <span style="color: #18b762; margin-right: 0.05rem">356</span>
          <span style="margin-right: 0.05rem">:</span>
          <span style="color: #e8503a">117</span>
        </div>
        <div class="chase_graph">
          <img src="static/img/market/chase.svg" alt="chase" />
        </div>
      </div>
      <div class="chase_status">
        <div class="chase_state_text">
          <span style="margin-right: 0.2rem">做涨停今表现</span>
          <span style="color: #18b762">99.26%</span>
        </div>
        <div class="chase_graph">
          <img src="static/img/market/todcondis.svg" alt="condi" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


</script>
<style>
.market_stock_chase {
  height: 5rem;
  box-shadow: 0 0.1rem 0.8rem 0 #014cfa33;
  border-radius: 0.64rem;
  position: relative;
  top: -1rem;
  padding-top: 1rem;
  padding-left: 0.32rem;
  padding-right: 0.32rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;

  .header_container {
    margin: 0.3rem 0;
    .header_text {
      width: 2.24rem;
      height: 0.5rem;
      border-radius: 0.25rem;
      border-width: 1px;
      border-color: #014cfa;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .header_eff_text {
        padding-left: 0.2rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #014cfa;
      }

      .header_noti_text {
        display: flex;
        flex-direction: row;
        width: 0.76rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background-color: #014cfa;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }

  .graph_container {
    height: 2.4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.1rem;
    font-size: 0.28rem;
    line-height: 0.32rem;

    .chase_graph {
      /* background-color: red; */
      width: 3.12rem;
      height: 2rem;
      margin-top: 0.36rem;
    }
  }
}
</style>
