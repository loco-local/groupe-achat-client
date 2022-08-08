import Service from '@/service/Service'
import Store from '@/store'

export default {
    register: function (member, recaptchaToken) {
        member.staySignedIn = true;
        member.recaptchaToken = recaptchaToken;
        return Service.api().post("/register", member);
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
