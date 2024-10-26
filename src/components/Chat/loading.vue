<template>

    <div class="loading">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="loading-mask"></div>
    </div>
</template>
<style scoped>
.loading{
    width: 100vw;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 19;
}
.loading-mask{
    width: 100vw;
    height: 100%;
    position: fixed;
    background: #ffffffd9;
    z-index: 20;
}
.lds-ring,
.lds-ring div {
    position: relative;
    z-index: 21;
    margin: 0 auto;
    text-align: center;
    box-sizing: border-box;
}

.lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #165dff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #165dff transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}

@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>