import Store from '@/store'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import i18next from 'i18next';
export default {
    setup: function () {
        let savedLocale = Store.state.locale;
        if (!savedLocale) {
            let localesArray = new I18nextBrowserLanguageDetector().detectors.navigator.lookup();
            let frIndex = localesArray.indexOf("fr");
            let enIndex = localesArray.indexOf("en");
            let isFrenchPreferredOverEnglish = frIndex !== -1 && frIndex < enIndex;
            savedLocale = Store.state.locale = isFrenchPreferredOverEnglish ? "fr" : "en";
        }
        Store.dispatch('setLocale', savedLocale);
        i18next.init({
            lng: savedLocale,
            resources: {
                en: {
                    translation: {
                        startDate: "Date de début",
                        endDate: "Date de fin",
                        name: "Name",
                        Email: "Email",
                        Phone: "Phone",
                        Messenger: "Messenger",
                        nones: "None",
                        member: "Membre",
                        admin: "Administrateur",
                        disabled: "Désactivé",
                        pending: "En attente",
                        copy: "Copy",
                        to: "to",
                        order: "Order",
                        total: "Total",
                        quantityShort: "Qté",
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
                        genderPreferNotAnswer: "Préfère ne pas répondre",
                        yes: "oui",
                        no: "non",
                        downloadAll: "Tout télécharger",
                        download: "Télécharger",
                        mustBeLowerOrEqualTo: "Doit être plus petit ou égal à",
                        mustBeHigherOrEqualTo: "Doit être égal ou plus grand que",
                        so: "Donc",
                        at: "at"
                    }
                },
                fr: {
                    translation: {
                        startDate: "Date de début",
                        endDate: "Date de fin",
                        name: "Nom",
                        Email: "Courriel",
                        Phone: "Téléphone",
                        Messenger: "Messenger",
                        nones: "Aucune",
                        member: "Membre",
                        admin: "Administrateur",
                        disabled: "Désactivé",
                        pending: "En attente",
                        copy: "Copier",
                        to: "au",
                        order: "Commande",
                        total: "Total",
                        quantityShort: "Qté",
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
                        genderPreferNotAnswer: "Préfère ne pas répondre",
                        yes: "oui",
                        no: "non",
                        downloadAll: "Tout télécharger",
                        download: "Télécharger",
                        mustBeLowerOrEqualTo: "Doit être plus petit ou égal à",
                        mustBeHigherOrEqualTo: "Doit être égal ou plus grand que",
                        so: "Donc",
                        at: "à"
                    }
                }
            }
        });
        return i18next;
    },
    i18next: i18next,
    getLocale: function () {
        return Store.state.locale;
    }
};
