import emailjs from "@emailjs/browser";

const _status = {
    didInit: false,
    config: null
}

export const useEmails = () => {
    /**
     * @param {Object} config
     */
    const init = (config) => {
        console.log("[init] Initializing EmailJS with config:", config); // CEK 1
        emailjs.init(config.publicKey);
        _status.config = config;
        _status.didInit = true;
    }

    /**
     * @return {boolean}
     */
    const isInitialized = () => {
        console.log("[isInitialized] Status:", _status.didInit); // CEK 1
        return _status.didInit;
    }

    /**
     * @param {string} fromName
     * @param {string} fromEmail
     * @param {string} customSubject
     * @param {string }message
     * @return {Promise<boolean>|Boolean}
     */
    const sendContactEmail = async (fromName, fromEmail, customSubject, message) => {
        if(!isInitialized()) {
            console.warn("[sendContactEmail] EmailJS belum di-init!");
            return false;
        }

        const params = {
            from_name: fromName,
            from_email: fromEmail,
            custom_subject: customSubject,
            message: message
        };

        console.log("[sendContactEmail] Params yang dikirim:", params); // CEK 2
        console.log("[sendContactEmail] Kirim ke service:", _status.config.serviceId); // Tambahan CEK
        console.log("[sendContactEmail] Gunakan template:", _status.config.templateId); // Tambahan CEK

        try {
            const response = await emailjs.send(
                _status.config['serviceId'],
                _status.config['templateId'],
                params
            );
            console.log("[sendContactEmail] Berhasil kirim email:", response); // CEK 3
            return true;
        } catch (error) {
            console.error("[sendContactEmail] Gagal kirim email:", error); // CEK 3
            return false;
        }
    }

    return {
        init,
        isInitialized,
        sendContactEmail
    }
}
