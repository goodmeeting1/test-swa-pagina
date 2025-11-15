// --- 1. CONFIGURAZIONE ---
const msalConfig = {
    auth: {
        // ID Applicazione (client)
        clientId: "283b4765-a2b4-4b99-983e-0dc3d4461297", // Lo prendi da Entra ID
        
        // ID Directory (tenant)
        authority: "https://login.microsoftonline.com/93f33571-550f-43cf-b09f-cd331338d086D", // Lo prendi da Entra ID
        
        // Lo inseriremo al Passo 4
        redirectUri: "https://victorious-meadow-0a0e4bf03.3.azurestaticapps.net/" 
    },
    cache: {
        cacheLocation: "sessionStorage" 
    }
};

// Il resto del codice è identico...
const msalClient = new msal.PublicClientApplication(msalConfig);
const loginRequest = { scopes: ["User.Read"] };
const loginButton = document.getElementById("loginButton");
const statusArea = document.getElementById("statusArea");

loginButton.onclick = () => {
    statusArea.innerText = "Avvio login...";
    msalClient.loginRedirect(loginRequest);
};

msalClient.handleRedirectPromise()
    .then( (response) => {
        if (response) {
            console.log("Login completato!", response);
            loginButton.style.display = "none";
            const username = response.account.username;
            const accessToken = response.accessToken; // <-- IL TOKEN
            statusArea.innerText = `Login effettuato!\n\n` +
                                   `Utente: ${username}\n\n` +
                                   `TOKEN:\n${accessToken}`;
        } else {
            const accounts = msalClient.getAllAccounts();
            if (accounts.length > 0) {
                loginButton.style.display = "none";
                statusArea.innerText = `Sei già loggato come ${accounts[0].username}.`;
            } else {
                statusArea.innerText = "Per favore, effettua il login.";
            }
        }
    })
    .catch( (error) => {
        console.error("Errore durante il login:", error);
        statusArea.innerText = "Errore: " + error.message;
    });