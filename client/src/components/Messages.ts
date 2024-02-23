// file to store all messages which are used in alerts on the pages
export const profileErrorMessages: { [key: string]: string } = {
    en: "You must fill everything except new password",
    fi: "Kaikki muut kentät ovat pakollisia, paitsi uusi salasana"
}
export const profileSuccessMessages: { [key: string]: string } = {
    en: "User updated. Please login again",
    fi: "Tiedot päivitetty. Ole hyvä ja kirjaudu uudestaan."
}
export const registrationSuccessMessages: { [key: string]: string } = {
    en: "Profile created. Log in to proceed",
    fi: "Käyttäjä luotu. jatka kirjautumalla sisään."
}
export const registrationErrorMessages: { [key: string]: string } = {
    en: "Error while creating profile. Check your credentials",
    fi: "Käyttäjän luonti ei onnistunut. Tarkista antamasi tiedot"
}
export const loginEmailErrorMessages: { [key: string]: string } = {
    en: "No user with this email",
    fi: "Tällä sähköpostilla ei ole käyttäjää."
}

export const loginPasswordErrorMessages: { [key: string]: string } = {
    en: "Password doesn't match",
    fi: "Salasana on väärä"
}
export const matchMessages: { [key: string]: string } = {
    en: "You got Match! Go to chat page to start chatting",
    fi: "Sait Osuman! Siirry chatti sivulle niin voit aloittaa keskustelun"
}