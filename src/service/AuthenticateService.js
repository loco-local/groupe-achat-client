import Service from '@/service/Service'
import Store from '@/store'

export default {
    register: function (user, recaptchaToken) {
        user.user_name = user.username;
        user.staySignedIn = true;
        user.recaptchaToken = recaptchaToken;
        return Service.api().post("/users/", user);
    },
    login: function (user, recaptchaToken) {
        user.staySignedIn = true;
        user.recaptchaToken = recaptchaToken;
        return Service.api().post("/login", user);
    },
    logout: async function () {
        await Service.api().delete("/users/session");
        await Promise.all([
            Store.dispatch('setUser', null),
            Store.dispatch('setXsrfToken', null)
        ]);
    }
};
