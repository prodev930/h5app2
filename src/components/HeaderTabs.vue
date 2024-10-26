<template>
     <div class="header_tabs">
        <slot name="before" />
        <div class="tabs">
            <div class="tab_body">
                <div class="tab" v-for="(tabNmae,i) in tabs" :key="i" :class="{ 'active_tab': active == i }" @click="changeActiveTab(i)">
                    <span class="tab-name">{{tabNmae}}</span>
                </div>
                
            </div>
        </div>
        <slot name="after" />
    </div>
</template>
<script setup>
const emit = defineEmits(['update:active','change'])
const props = defineProps({
    active:{
        type:Number,
        default:0
    },
    tabs:{
        type:Array,
        default(){
            return []
        }
    }
})
const changeActiveTab = (val)=>{
    emit('update:active',val)
    emit('change',val)
}

</script>

<style lang="less" scoped>
.header_tabs {
    height: 1.12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;

    .tabs {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;

        .tab_body {
            flex: 1;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            overflow-x: auto;
            margin: 0 0.2rem;
        }

        .tab {
            font-size: .28rem;
            color: #666D80;
            padding: 0 .22rem;
            height: .66rem;
            line-height: 0;
            border-radius: .48rem;
            display: flex;
            padding-bottom: 0.06rem;
            align-items: center;
            cursor: pointer;
            white-space: nowrap;
            position: relative;
        
            .tab-name{
                position: relative;
                z-index: 1;
                transition: .3s;
            }
            &::after{
                content: '';
                width: 0.6rem;
                height: 0.2rem;
                background-color: #014CFA;
                position: absolute;
                bottom: 0;
                left:50%;
                margin-left: -0.3rem;
                border-radius: 0.6rem;
                transition: .3s;
                opacity: 0;
                transform: scale(0);
            }
        }

        .active_tab {
            color: #061023;
            font-weight: 700;
            opacity: 1;
            .tab-name{
                font-size: 0.56rem;
            }
            &::after{
                opacity: 1;
                transform: scale(1);
            }
        }

    }

}
</style>