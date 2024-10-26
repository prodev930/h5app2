<!-- 身份认证2 -->
<template>
    <div class="kyc_2">

        <Top :title="'身份认证'">
            <!-- 从注册来的 -->
            <template #right v-if="from == 'register'">
                <span @click="nextStep" style="color: #014CFA;font-weight: 400;font-size: 0.28rem;">跳过</span>
            </template>
            <!-- 从个人中心来的 -->
            <template #right v-else>
                <div @click="goTip" style="display: flex;align-items: center;line-height: 0;">
                    <div style="width: 0.24rem;height: 0.24rem;position: relative;top:-0.01rem;left:-0.04rem">
                        <img src="/static/img/user/warning.png" alt="icon">
                    </div>
                    <span style="color: #014CFA;font-weight: 400;font-size: 0.24rem;">照片上传要求</span>
                </div>
            </template>
            <!-- 提交过认证信息 -->
            <template #right v-if="kycInfo.idimg_1">
                <div class="kyc_status">
                    <!-- <div class="icon">
                        <img class="status_icon" src="/static/img/user/record.png" alt="⚪">
                    </div> -->
                    <span class="status" v-if="kycInfo.status == 'review'">审核中</span>
                    <span class="status status_pass" v-if="kycInfo.status == 'success'">审核通过</span>
                    <span class="status status_fail" v-if="kycInfo.status == 'failure'">审核失败</span>
                </div>
            </template>
        </Top>
        <!-- 查看模式头部 -->
        <Tabs @change="preStep" class="tabs" v-if="checkMode" style="width:100%" :lazy-render="false"
            v-model:active="activeTab" sticky animated shrink>
            <Tab :title="'身份信息'"></Tab>
            <Tab :title="'照片'"></Tab>
        </Tabs>

        <!-- 表单模式头部 -->
        <div class="steps" v-if="!checkMode">
            <div class="step curr_step">1</div>
            <div class="line"></div>
            <div class="step finish_step">2</div>
        </div>
        <div class="title" v-if="!checkMode">上传照片</div>

        <!-- 表单 -->
        <!-- 上传元素 -->
        <div class="item">
            <!-- 没有上传 -->
            <div class="item_box content" v-if="!files.front.loading && !files.front.url">
                <!-- 图标 -->
                <div class="camera">
                    <img src="/static/img/user/camera.png" alt="📷">
                </div>
                <div class="title">拍摄证件正面</div>
                <!-- 左上角 -->
                <div class="subtitle">
                    <div>证件正面</div>
                    <span>上传证件正面</span>
                </div>
                <!-- 背后 -->
                <!-- <div class="icon">
                    <img src="/static/img/user/iden_bg_1.png" alt="📷">
                </div> -->
            </div>
            <!-- 上传中 -->
            <div class="item_box loading" v-if="files.front.loading">
                <Loaidng :loading="files.front.loading" />
            </div>
            <!-- 已上传 -->
            <div class="item_box success" v-if="files.front.url">
                <img :src="files.front.url" alt="img">

                <div class="delete_icon" @click="deleteImg('front')" v-if="!checkMode">
                    <img src="/static/img/user/delete.png" alt="x">
                </div>
            </div>
            <!-- 上传 -->
            <Uploader v-if="!checkMode" :name="'front'" class="uploader" :after-read="afterRead" />
        </div>
        <div class="item">
            <!-- 没有上传 -->
            <div class="item_box content" v-if="!files.back.loading && !files.back.url">
                <!-- 图标 -->
                <div class="camera">
                    <img src="/static/img/user/camera.png" alt="📷">
                </div>
                <div class="title">拍摄证件反面</div>
                <!-- 左上角 -->
                <div class="subtitle">
                    <div>证件反面</div>
                    <span>上传证件反面</span>
                </div>
                <!-- 背后 -->
                <!-- <div class="icon">
                    <img src="/static/img/user/iden_bg_2.png" alt="📷">
                </div> -->
            </div>
            <!-- 上传中 -->
            <div class="item_box loading" v-if="files.back.loading">
                <Loaidng :loading="files.back.loading" />
            </div>
            <!-- 已上传 -->
            <div class="item_box success" v-if="files.back.url">
                <img :src="files.back.url" alt="img">

                <div class="delete_icon" @click="deleteImg('back')" v-if="!checkMode">
                    <img src="/static/img/user/delete.png" alt="x">
                </div>
            </div>
            <!-- 上传 -->
            <Uploader v-if="!checkMode" :name="'back'" class="uploader" :after-read="afterRead" />
        </div>
        <div class="item">
            <!-- 没有上传 -->
            <div class="item_box content" v-if="!files.hand.loading && !files.hand.url">
                <!-- 图标 -->
                <div class="camera">
                    <img src="/static/img/user/camera.png" alt="📷">
                </div>
                <div class="title">拍摄证件手持面</div>
                <!-- 左上角 -->
                <div class="subtitle">
                    <div>手持面</div>
                    <span>上传证件手持面</span>
                </div>
                <!-- 背后 -->
                <!-- <div class="icon">
                    <img src="/static/img/user/iden_bg_3.png" alt="📷">
                </div> -->
            </div>
            <!-- 上传中 -->
            <div class="item_box loading" v-if="files.hand.loading">
                <Loaidng :loading="files.hand.loading" />
            </div>
            <!-- 已上传 -->
            <div class="item_box success" v-if="files.hand.url">
                <img :src="files.hand.url" alt="img">

                <div class="delete_icon" @click="deleteImg('hand')" v-if="!checkMode">
                    <img src="/static/img/user/delete.png" alt="x">
                </div>
            </div>
            <!-- 上传 -->
            <Uploader v-if="!checkMode" :name="'hand'" class="uploader" :after-read="afterRead" />
        </div>

        <!-- 上传要求 -->
        <!-- <div class="upload_title">
            <div class="line"></div>
            <div class="name">上传证件照片要求</div>
            <div class="line"></div>
        </div> -->

        <!-- 上传细则 -->
        <!-- <div class="upload_rules">
            <div class="upload_rule">
                <div class="rule_img">
                    <img src="/static/img/user/kyc_rule_1.png" alt="1">
                </div>
                <div class="rule_text">
                    <div class="rule_flag">
                        <img src="/static/img/user/o.png" alt="√">
                    </div>
                    <span>标准</span>
                </div>
            </div>
            <div class="upload_rule">
                <div class="rule_img">
                    <img src="/static/img/user/kyc_rule_2.png" alt="1">
                </div>
                <div class="rule_text">
                    <div class="rule_flag">
                        <img src="/static/img/user/x.png" alt="×">
                    </div>
                    <span>边框缺失</span>
                </div>
            </div>
            <div class="upload_rule">
                <div class="rule_img">
                    <img src="/static/img/user/kyc_rule_3.png" alt="1">
                </div>
                <div class="rule_text">
                    <div class="rule_flag">
                        <img src="/static/img/user/x.png" alt="×">
                    </div>
                    <span>照片模糊</span>
                </div>
            </div>
            <div class="upload_rule">
                <div class="rule_img">
                    <img src="/static/img/user/kyc_rule_4.png" alt="1">
                </div>
                <div class="rule_text">
                    <div class="rule_flag">
                        <img src="/static/img/user/x.png" alt="×">
                    </div>
                    <span>光线强烈</span>
                </div>
            </div>
        </div> -->

        <!-- 联系客服 -->
        <div class="server_link" v-if="!checkMode">
            无法上传照片？联系<span>在线客服</span>
        </div>

        <!-- 提交 -->
        <Button v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'" :color="disabled ? '#C8CED5' : '#014CFA'"
            @click="submit" :loading="loading" :disabled="disabled" round class="submit" type="primary">完成</Button>
        <!-- <Button v-if="kycInfo.status == 'review' || kycInfo.status == 'success'" color="#014CFA" @click="nextStep"
            :loading="loading" round class="submit" type="primary">完成</Button> -->
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Uploader, Button, showToast, Tabs, Tab } from 'vant';
import { ref, computed } from "vue";
import { UPLOAD_ADDRESS, UPLOAD_TOKEN } from "@/config.js"
import { _fetchWithTimeout } from "@/api/upload"
import Loaidng from "@/components/Loaidng.vue"
import { _compressImg } from "@/utils/index"
import { _kyc2, _kycGet } from "@/api/api"
import router from "@/router"
import { useRoute } from "vue-router"

const route = useRoute()
const from = ref(route.query.from) // 'register'-表示从注册来

const activeTab = ref(1)
const props = defineProps({
    kycInfo: {
        type: Object,
        default: () => { }
    }
})
const loading = ref(false)
const disabled = computed(() => {
    return !(files.value.front.url && files.value.back.url && files.value.hand.url)
})
const checkMode = computed(() => {
    return props.kycInfo.status == 'review' || props.kycInfo.status == 'success'
})
// 表单
const files = ref({
    front: {
        url: '',
        loading: false,
        file: {}
    },
    back: {
        url: '',
        loading: false,
        file: {}
    },
    hand: {
        url: '',
        loading: false,
        file: {}
    },
})

const deleteImg = key => {
    files.value[key] = {
        url: '',
        loading: false,
        file: {}
    }
}

if (props.kycInfo) {
    files.value.front.url = props.kycInfo.idimg_1
    files.value.back.url = props.kycInfo.idimg_2
    files.value.hand.url = props.kycInfo.idimg_3
}


const submit = () => {
    if (loading.value) return
    loading.value = true
    _kyc2({
        idimg_1: files.value.front.url,
        idimg_2: files.value.back.url,
        idimg_3: files.value.hand.url,
    }).then(res => {
        if (res.code == 200) {
            if (from.value = 'register') {
                setTimeout(() => {
                    showToast('提交成功')
                }, 300)
                nextStep()
            } else {
                router.replace({
                    name: 'submit'
                })
            }
        }
    }).finally(() => {
        loading.value = false
    })
}


const nextStep = () => {
    router.replace({
        name: 'user'
    })
}
const emits = defineEmits(['pre', 'info'])
const preStep = () => {
    emits('pre')
}
const goTip = () => {
    emits('info')
}

// 图片处理
const afterRead = (file, { name }) => {


    files.value[name].file = file.objectUrl

    let fileName = file.file.name  // 'test.png'
    fileName = [fileName.split('.')[0] + Date.now(), fileName.split('.')[1]].join('.')
    const apiUrl = `${UPLOAD_ADDRESS}${fileName}`

    const reader = new FileReader();
    reader.onloadend = function () {
        let ratio = 0.5
        const size = file.file.size / 1024
        if (size < 50) {
            ratio = 1
        } else if (size < 150) {
            ratio = 0.9
        } else {
            ratio = 0.5
        }
        files.value[name].loading = true
        _compressImg(reader.result, ratio, (base64Img) => {
            const base64result = base64Img.substr(base64Img.indexOf(',') + 1);

            _fetchWithTimeout(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': UPLOAD_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: base64result, message: `upload ${fileName}`
                })
            }).then(response => response.json())
                .then(data => {
                    const { content: { download_url } } = data
                    files.value[name].url = download_url
                }).finally(() => {
                    files.value[name].loading = false
                })
        })
    }
    reader.readAsDataURL(file.file);
};
</script>

<style lang="less" scoped>
.kyc_2 {
    padding: 1.24rem 0.32rem 0.4rem 0.32rem;
    height: 100%;
    overflow-y: auto;

    .steps {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.52rem;

        .step {
            background-color: #E5E4E9;
            width: 0.48rem;
            height: 0.48rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
            border-radius: 50%;
            color: #B0AFB4;
        }

        .curr_step {
            border: 2px solid #014CFA;
            background-color: #fff;
        }

        .finish_step {
            background-color: #014CFA;
            color: #fff;
        }

        .line {
            height: 3px;
            border-radius: 3px;
            background-color: #D9D9D9;
            width: 1rem;
            margin: 0 0.2rem;
        }
    }

    .kyc_status {
        display: flex;
        align-items: center;

        .icon {
            width: 0.8rem;
            height: 0.8rem;
            background-color: #EDEDED;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.16rem;

            .status_icon {
                width: 0.48rem !important;
                height: 0.48rem !important;
            }
        }

        .status {
            font-size: 0.28rem;
            font-weight: 400;
            color: #F3BA2F;
        }

        .status_pass {
            color: #38A843;
        }

        .status_fail {
            color: #E8503A;
        }
    }

    .title {
        color: #0D0D12;
        font-weight: 600;
        font-size: 0.48rem;
        line-height: 0.8rem;
        margin-bottom: 0.6rem;
    }

    .upload_title {
        margin: 0.6rem 0 0.32rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: #404040;
        font-weight: 400;

        .line {
            flex: 1;
            margin: 0 0.12rem;
            height: 1px;
            background-color: #F2F2F2;
        }
    }

    .server_link {
        margin: 0.4rem 0;
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.24rem;
        font-weight: 400;

        span {
            color: #1A59F6;
        }
    }

    .upload_rules {
        display: flex;
        align-items: stretch;
        justify-content: space-between;

        .upload_rule {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .rule_img {
                width: 1.2rem;
                height: 1.2rem;
                margin-bottom: 0.4rem;
            }

            .rule_text {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.24rem;
                color: rgba(0, 0, 0, 0.6);
                font-weight: 400;

                .rule_flag {
                    width: 0.32rem;
                    height: 0.32rem;
                    margin-right: 0.08rem;
                }
            }
        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
    }

    .item {
        height: 4rem;
        border: 1px dashed #2972F6;
        border-radius: 0.16rem;
        margin-bottom: 0.32rem;
        overflow: hidden;
        background-color: rgba(227, 236, 252, 0.3);
        position: relative;

        .uploader {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 99;
            opacity: 0;

            :deep(.van-uploader__wrapper) {
                width: 100%;
                height: 100%;

                .van-uploader__upload {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .item_box {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: relative;

            >img {
                object-fit: fill !important;
            }

            .delete_icon {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.64rem;
                height: 0.64rem;
                z-index: 9998;
                padding: 0.14rem;
                border-radius: 50%;
                background-color: #fff;
            }
        }

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .camera {
                width: 0.96rem;
                height: 0.96rem;
                margin-bottom: 0.08rem;
                margin-top: 0.6rem;
                position: relative;
                z-index: 9;
            }

            .title {
                font-weight: 400;
                color: #1A59F6;
                font-size: 0.36rem;
                line-height: 0.42rem;
                text-align: center;
                position: relative;
                z-index: 9;
            }

            .subtitle {
                position: absolute;
                z-index: 2;
                top: 0.42rem;
                left: 0.44rem;
                font-size: 0.36rem;
                color: #212121;
                line-height: 0.44rem;

                span {
                    font-size: 0.24rem;
                    color: #A8A8A8;
                    font-weight: 400;
                    line-height: 0.34rem;
                }
            }

            .icon {
                position: absolute;
                z-index: 1;
                width: 3.76rem;
                height: 2.44rem;
                top: 0.42rem;
                right: 0.44rem;
            }
        }

        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .tabs {
        margin-bottom: 0.4rem;

        :deep(.van-tabs__nav) {
            &::after {
                content: "";
                width: 100%;
                height: 0.02rem;
                background-color: #3b82f6;
                position: absolute;
                bottom: 0.32rem;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}
</style>
