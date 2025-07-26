export const validationUtils = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password: string): boolean => {
        // At least 4 characters (matching backend requirements)
        return password.length >= 4;
    },

    isValidName: (name: string): boolean => {
        return name.trim().length >= 2;
    },

    isValidUsername: (username: string): boolean => {
        // Username validation: 3-30 characters, letters, numbers, underscores only
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username) && /^[a-zA-Z0-9]/.test(username);
    },

    isNotEmpty: (value: string): boolean => {
        return value.trim().length > 0;
    },

    validateAuthCredentials: (credentials: {
        name?: string;
        email: string;
        password: string;
        username?: string;
    }): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (credentials.name && !validationUtils.isValidName(credentials.name)) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!validationUtils.isValidEmail(credentials.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!validationUtils.isValidPassword(credentials.password)) {
            errors.push('Password must be at least 6 characters with uppercase, lowercase, and number');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    },

    validateLoginCredentials: (credentials: {
        emailOrUsername: string;
        password: string;
    }): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Check if input is email or username
        const isEmail = validationUtils.isValidEmail(credentials.emailOrUsername);
        const isUsername = validationUtils.isValidUsername(credentials.emailOrUsername);

        if (!isEmail && !isUsername) {
            errors.push('Please enter a valid email address or username');
        }

        if (!validationUtils.isValidPassword(credentials.password)) {
            errors.push('Password must be at least 4 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    },

    validateRegistrationCredentials: (credentials: {
        name: string;
        email: string;
        username: string;
        password: string;
    }): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!validationUtils.isValidName(credentials.name)) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!validationUtils.isValidEmail(credentials.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!validationUtils.isValidUsername(credentials.username)) {
            errors.push('Username must be 3-30 characters, contain only letters, numbers, and underscores, and start with a letter or number');
        }

        if (!validationUtils.isValidPassword(credentials.password)) {
            errors.push('Password must be at least 4 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    },
}; 