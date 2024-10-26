<!-- 密码等级 -->
<template>
    <div class="password_level" :class="'password_level_' + levels">
        <div class="levels">
            <div class="level level_active" v-for="i in levels" :key="i"></div>
            <div class="level" v-for="i in (4 - levels)" :key="i"></div>
        </div>
        <span v-if="levels">
            {{ levelsMap[levels] }}
        </span>
    </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    password: {
        type: String,
        default: ''
    }
})

const levelsMap = {
    0: '弱',
    1: '弱',
    2: '中等',
    3: '中等',
    4: '优秀'
}
const levels = computed(() => {
    const password = props.password


    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[\W_]/.test(password);

    // 初始评估等级为0（弱）
    let strength = 0;
    // 如果密码长度大于等于最小长度，增加评估等级
    if (password.length >= minLength) {
        // 如果密码包含大写字母，增加评估等级
        if (hasUpperCase) strength += 1;
        // 如果密码包含小写字母，增加评估等级
        if (hasLowerCase) strength += 1;
        // 如果密码包含数字，增加评估等级
        if (hasNumbers) strength += 1;
        // 如果密码包含特殊字符，增加评估等级
        if (hasSpecialChars) strength += 1;
    } else {
        strength = password.length ? 1 : 0
    }
    return strength > 4 ? 4 : strength
})
</script>

<style lang="less" scoped>
.password_level {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.24rem;
    color: #FF5757;

    .levels {
        display: flex;
        align-items: center;
        margin-right: 0.16rem;

        .level {
            width: 0.4rem;
            height: 0.06rem;
            background-color: #D9D9D9;
            margin-right: 0.08rem;
            border-radius: 0.04rem;
        }
    }
}

.password_level_1,
.password_level_2,
.password_level_3 {
    color: #E53E00;

    .levels {
        .level_active {
            background-color: #FF5757;
        }
    }
}

.password_level_4 {
    color: #00AF70;

    .levels {
        .level_active {
            background-color: #00AF70;
        }
    }
}
</style>