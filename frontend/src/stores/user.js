import {ref} from "vue";
import {defineStore} from "pinia";

export const useUserStore = defineStore('user', ()  => {
    const id = ref(0)
    const username = ref('')
    const photo = ref('')
    const profile = ref('')
    const accessToken = ref('')

    const HasPulledUserInfo = ref(false)

    function isLogin() {
        return !!accessToken.value
    }

    function setAccessToken(token) {
        accessToken.value = token
    }

    function setUserInfo(data) {
        id.value = data.user_id
        username.value = data.username
        photo.value = data.photo
        profile.value = data.profile

    }

    function logout() {
        id.value = 0
        username.value = ''
        photo.value = ''
        profile.value = ''
        accessToken.value = ''
    }

    function SetHasPulledUserInfo(newStatus) {
        HasPulledUserInfo.value = newStatus
    }

    return {
        id,
        username,
        photo,
        profile,
        accessToken,
        setAccessToken,
        logout,
        isLogin,
        setUserInfo,
        HasPulledUserInfo,
        SetHasPulledUserInfo,
    }
})