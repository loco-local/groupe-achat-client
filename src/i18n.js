import Vue from 'vue'
import Store from '@/store'
import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

export default {
    setup: function () {
        Vue.use(VueI18Next);
        let savedLocale = Store.state.locale;
        if (!savedLocale) {
            let localesArray = new I18nextBrowserLanguageDetector().detectors.navigator.lookup();
            let frIndex = localesArray.indexOf("fr");
            let enIndex = localesArray.indexOf("en");
            let isFrenchPreferredOverEnglish = frIndex !== -1 && frIndex < enIndex;
            savedLocale = Store.state.locale = isFrenchPreferredOverEnglish ? "fr" : "en";
        }
        String.prototype.noAccents = function () {
            var accent = [
                /[\300-\306]/g, /[\340-\346]/g, // A, a
                /[\310-\313]/g, /[\350-\353]/g, // E, e
                /[\314-\317]/g, /[\354-\357]/g, // I, i
                /[\322-\330]/g, /[\362-\370]/g, // O, o
                /[\331-\334]/g, /[\371-\374]/g, // U, u
                /[\321]/g, /[\361]/g, // N, n
                /[\307]/g, /[\347]/g, // C, c
            ];
            var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

            var str = this;
            for (var i = 0; i < accent.length; i++) {
                str = str.replace(accent[i], noaccent[i]);
            }

            return str;
        }
        Store.dispatch('setLocale', savedLocale);
        i18next.init({
            lng: savedLocale,
            resources: {
                en: {
                    translation: {
                        startDate : "Date de début",
                        endDate: "Date de fin",
                        name:"Name",
                        Email: "Email",
                        Phone: "Phone",
                        Messenger: "Messenger",
                        nones: "None",
                        member: "Membre",
                        admin: "Administrateur",
                        disabled: "Désactivé",
                        copy: "Copy",
                        to: "to",
                        finish: "Finish",
                        close: 'Close',
                        ignore: "Ignore",
                        login: 'Login',
                        register: 'Register',
                        search: 'Search',
                        logout: "Logout",
                        quantity: "Quantity",
                        add: "Add",
                        confirm: "Confirm",
                        create: "Create",
                        modify: "Modify",
                        continue: "Continue",
                        cancel: "Cancel",
                        save: "Sauvegarder",
                        remove: "Remove",
                        users: "Users",
                        noSearchResults: "No search results",
                        'required': "Required",
                        invalidEmail: 'invalid email',
                        min8Char: "Minimum of 8 characters",
                        max255Char: "Maximum of 255 characters",
                        noSpace: "Il ne devrait pas y avoir d'espace",
                        min1: "La valeur minimale est de 1",
                        send: "Send",
                        change: "Change",
                        nonBinary: "Non binaire",
                        male: "Homme",
                        female: "Femme",
                        genderPreferNotAnswer: "Préfère ne pas répondre"
                    }
                },
                fr: {
                    translation: {
                        startDate : "Date de début",
                        endDate: "Date de fin",
                        name:"Nom",
                        Email: "Courriel",
                        Phone: "Téléphone",
                        Messenger: "Messenger",
                        nones: "Aucune",
                        member: "Membre",
                        admin: "Administrateur",
                        disabled: "Désactivé",
                        copy: "Copier",
                        to: "au",
                        finish: "Terminer",
                        close: 'Fermer',
                        ignore: "Ignorer et continuer",
                        login: 'Connexion',
                        register: "S'inscrire",
                        search: 'Chercher',
                        logout: "Déconnexion",
                        quantity: "Quantité",
                        add: "Ajouter",
                        confirm: "Confirmer",
                        create: "Créer",
                        modify: "Modifier",
                        continue: "Continuer",
                        cancel: "Annuler",
                        save: "Sauvegarder",
                        remove: "Supprimer",
                        users: "Usagers",
                        noSearchResults: "Pas de résultats de recherche",
                        'required': "Requis",
                        invalidEmail: 'courriel invalide',
                        min8Char: "Minimum de 8 caractères",
                        max255Char: "Maximum de 255 caractères",
                        noSpace: "Il ne devrait pas y avoir d'espace",
                        min1: "La valeur minimale est de 1",
                        send: "Envoyer",
                        change: "Modifier",
                        nonBinary: "Non binaire",
                        male: "Homme",
                        female: "Femme",
                        genderPreferNotAnswer: "Préfère ne pas répondre"
                    }
                }
            }
        });
        return new VueI18Next(i18next);
    },
    i18next: i18next,
    getLocale: function () {
        return Store.state.locale;
    }
};
