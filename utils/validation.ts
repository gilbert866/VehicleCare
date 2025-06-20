export const validationUtils = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password: string): boolean => {
        // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    },

    isValidName: (name: string): boolean => {
        return name.trim().length >= 2;
    },

    isNotEmpty: (value: string): boolean => {
        return value.trim().length > 0;
    },

    validateAuthCredentials: (credentials: {
        name?: string;
        email: string;
        password: string;
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
}; 