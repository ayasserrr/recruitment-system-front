// Simple in-memory user database
// In a real application, this would be replaced with a proper database

class UserDatabase {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        const storedUsers = localStorage.getItem('hiretech_users');
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    saveUsers() {
        localStorage.setItem('hiretech_users', JSON.stringify(this.users));
    }

    addUser(userData) {
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, user: newUser };
    }

    authenticateUser(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            return { success: true, user };
        } else {
            return { success: false, message: 'Invalid email or password. Please sign up first.' };
        }
    }

    getUserByEmail(email) {
        const user = this.users.find(user => user.email === email);
        return user ? { success: true, user } : { success: false, message: 'User not found' };
    }
}

export default new UserDatabase();
